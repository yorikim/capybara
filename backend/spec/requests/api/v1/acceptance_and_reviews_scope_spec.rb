require "rails_helper"

RSpec.describe "Api::V1::AcceptanceActs and Reviews scope", type: :request do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }

  it "allows customer to create acceptance act for own order" do
    order = Order.create!(furniture_maker: maker, title: "Own order", status: :awaiting_acceptance, customer_uid: "customer-a")

    post "/api/v1/orders/#{order.id}/acceptance_act",
         headers: api_headers_for(:customer, customer_uid: "customer-a"),
         params: { acceptance_act: { accepted_at: Time.current.iso8601, notes: "Accepted" } }

    expect(response).to have_http_status(:created)
    expect(order.reload.status).to eq("completed")
  end

  it "does not allow customer to create acceptance act for another customer order" do
    order = Order.create!(furniture_maker: maker, title: "Other order", status: :awaiting_acceptance, customer_uid: "customer-b")

    post "/api/v1/orders/#{order.id}/acceptance_act",
         headers: api_headers_for(:customer, customer_uid: "customer-a"),
         params: { acceptance_act: { accepted_at: Time.current.iso8601, notes: "Accepted" } }

    expect(response).to have_http_status(:not_found)
  end

  it "allows customer to review own order" do
    order = Order.create!(furniture_maker: maker, title: "Own order", status: :completed, customer_uid: "customer-a")

    post "/api/v1/orders/#{order.id}/review",
         headers: api_headers_for(:customer, customer_uid: "customer-a"),
         params: { review: { rating: 5, comment: "Excellent" } }

    expect(response).to have_http_status(:created)
    expect(order.reload.review).to be_present
  end

  it "does not allow customer to review another customer order" do
    order = Order.create!(furniture_maker: maker, title: "Other order", status: :completed, customer_uid: "customer-b")

    post "/api/v1/orders/#{order.id}/review",
         headers: api_headers_for(:customer, customer_uid: "customer-a"),
         params: { review: { rating: 5, comment: "Excellent" } }

    expect(response).to have_http_status(:not_found)
  end
end
