require "rails_helper"

RSpec.describe "Api::V1::Orders transitions", type: :request do
  let(:headers) { { "Authorization" => "Bearer capybara-dev-token" } }
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }

  it "allows valid transition" do
    order = Order.create!(furniture_maker: maker, title: "Order A", status: :draft)

    patch "/api/v1/orders/#{order.id}/transition", params: { to_status: "published" }, headers: headers

    expect(response).to have_http_status(:ok)
    expect(order.reload.status).to eq("published")
  end

  it "rejects invalid transition" do
    order = Order.create!(furniture_maker: maker, title: "Order A", status: :draft)

    patch "/api/v1/orders/#{order.id}/transition", params: { to_status: "completed" }, headers: headers

    expect(response).to have_http_status(:unprocessable_content)
    expect(JSON.parse(response.body).dig("error", "code")).to eq("invalid_transition")
  end

  it "returns forbidden for customer role on transition" do
    order = Order.create!(furniture_maker: maker, title: "Order A", status: :draft)

    patch "/api/v1/orders/#{order.id}/transition", params: { to_status: "published" }, headers: api_headers_for(:customer)

    expect(response).to have_http_status(:forbidden)
    expect(JSON.parse(response.body).dig("error", "code")).to eq("forbidden")
  end

  it "does not allow furniture maker to transition other maker order" do
    other_maker = FurnitureMaker.create!(name: "Other Maker", bin_iin: "123456789098")
    order = Order.create!(furniture_maker: other_maker, title: "Order B", status: :draft)

    patch "/api/v1/orders/#{order.id}/transition",
          params: { to_status: "published" },
          headers: api_headers_for(:furniture_maker, furniture_maker: maker)

    expect(response).to have_http_status(:not_found)
  end
end
