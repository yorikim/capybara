require "rails_helper"

RSpec.describe "Api::V1::Orders scope", type: :request do
  let(:maker_a) { FurnitureMaker.create!(name: "Maker A", bin_iin: "123456789012") }
  let(:maker_b) { FurnitureMaker.create!(name: "Maker B", bin_iin: "123456789013") }

  it "shows furniture maker only own orders in list" do
    own_order = Order.create!(furniture_maker: maker_a, title: "Own", status: :draft)
    Order.create!(furniture_maker: maker_b, title: "Other", status: :draft)
    headers = api_headers_for(:furniture_maker, furniture_maker: maker_a)

    get "/api/v1/orders", headers: headers

    expect(response).to have_http_status(:ok)
    ids = JSON.parse(response.body).fetch("data").map { |row| row["id"] }
    expect(ids).to eq([own_order.id])
  end

  it "does not allow furniture maker to view other maker order" do
    other_order = Order.create!(furniture_maker: maker_b, title: "Other", status: :draft)
    headers = api_headers_for(:furniture_maker, furniture_maker: maker_a)

    get "/api/v1/orders/#{other_order.id}", headers: headers

    expect(response).to have_http_status(:not_found)
  end

  it "forces furniture_maker_id from token on order create" do
    headers = api_headers_for(:furniture_maker, furniture_maker: maker_a)

    post "/api/v1/orders",
         headers: headers,
         params: { order: { title: "Scoped create", furniture_maker_id: maker_b.id } }

    expect(response).to have_http_status(:created)
    expect(Order.last.furniture_maker_id).to eq(maker_a.id)
  end

  it "shows customer only own orders in list" do
    own_order = Order.create!(furniture_maker: maker_a, title: "Own customer", status: :draft, customer_uid: "customer-a")
    Order.create!(furniture_maker: maker_a, title: "Other customer", status: :draft, customer_uid: "customer-b")

    get "/api/v1/orders", headers: api_headers_for(:customer, customer_uid: "customer-a")

    expect(response).to have_http_status(:ok)
    ids = JSON.parse(response.body).fetch("data").map { |row| row["id"] }
    expect(ids).to eq([own_order.id])
  end

  it "forces customer_uid from token on order create" do
    headers = api_headers_for(:customer, customer_uid: "customer-a")

    post "/api/v1/orders",
         headers: headers,
         params: { order: { title: "Customer scoped", furniture_maker_id: maker_a.id, customer_uid: "other-customer" } }

    expect(response).to have_http_status(:created)
    expect(Order.last.customer_uid).to eq("customer-a")
  end

  it "does not allow customer to view another customer order" do
    other_order = Order.create!(furniture_maker: maker_a, title: "Other customer", status: :draft, customer_uid: "customer-b")

    get "/api/v1/orders/#{other_order.id}", headers: api_headers_for(:customer, customer_uid: "customer-a")

    expect(response).to have_http_status(:not_found)
  end
end
