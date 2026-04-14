require "rails_helper"

RSpec.describe "Api::V1::ChangeRequests", type: :request do
  let(:headers) { { "Authorization" => "Bearer capybara-dev-token" } }
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }

  it "updates commercial terms only through approved change request after spec approval" do
    order = Order.create!(furniture_maker: maker, title: "Order A", status: :awaiting_design_approval, total_price: 100_000, deadline_at: Date.current + 14.days)
    order.specifications.create!(version: 1, payload: { approved: true }, approved_at: Time.current)

    patch "/api/v1/orders/#{order.id}/transition", params: { to_status: "in_production" }, headers: headers
    expect(response).to have_http_status(:ok)

    order.update(total_price: 200_000)
    expect(order.errors[:base]).to include("Price and deadline can be changed only via approved change request")

    post "/api/v1/orders/#{order.id}/change_requests",
         params: { change_request: { proposed_price: 200_000 } },
         headers: headers
    expect(response).to have_http_status(:created)

    change_request_id = JSON.parse(response.body).dig("data", "id")
    patch "/api/v1/change_requests/#{change_request_id}/approve", headers: headers

    expect(response).to have_http_status(:ok)
    expect(order.reload.total_price.to_i).to eq(200_000)
  end

  it "forbids approving change request for customer role" do
    order = Order.create!(furniture_maker: maker, title: "Order B", status: :published)
    change_request = order.change_requests.create!(status: "pending", proposed_price: 220_000)

    patch "/api/v1/change_requests/#{change_request.id}/approve", headers: api_headers_for(:customer)

    expect(response).to have_http_status(:forbidden)
    expect(JSON.parse(response.body).dig("error", "code")).to eq("forbidden")
    expect(change_request.reload.status).to eq("pending")
  end

  it "does not allow furniture maker to create change request for other maker order" do
    other_maker = FurnitureMaker.create!(name: "Other Maker", bin_iin: "123456789099")
    order = Order.create!(furniture_maker: other_maker, title: "Order C", status: :published)

    post "/api/v1/orders/#{order.id}/change_requests",
         params: { change_request: { proposed_price: 300_000 } },
         headers: api_headers_for(:furniture_maker, furniture_maker: maker)

    expect(response).to have_http_status(:not_found)
  end

  it "does not allow customer to create change request for another customer order" do
    order = Order.create!(furniture_maker: maker, title: "Order D", status: :published, customer_uid: "customer-b")

    post "/api/v1/orders/#{order.id}/change_requests",
         params: { change_request: { proposed_price: 150_000 } },
         headers: api_headers_for(:customer, customer_uid: "customer-a")

    expect(response).to have_http_status(:not_found)
  end
end
