require "rails_helper"

RSpec.describe "Api::V1::FurnitureMakers score", type: :request do
  let(:headers) { api_headers_for(:production_staff) }

  before do
    maker = FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012")
    3.times do |idx|
      order = maker.orders.create!(
        title: "Order #{idx + 1}",
        status: :completed,
        total_price: 100_000 + idx * 10_000,
        updated_at: idx.days.ago
      )
      order.create_review!(rating: 5, comment: "Good")
    end
  end

  it "returns score for existing maker by bin_iin" do
    get "/api/v1/furniture_makers/123456789012/score", headers: headers

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["bin_iin"]).to eq("123456789012")
    expect(body["score_band"]).to be_present
    expect(body["components"]).to include("recency", "frequency", "volume", "quality")
  end

  it "returns unified 404 for unknown maker" do
    get "/api/v1/furniture_makers/000000000000/score", headers: headers

    expect(response).to have_http_status(:not_found)
    body = JSON.parse(response.body)
    expect(body.dig("error", "code")).to eq("maker_not_found")
  end

  it "requires authorization" do
    get "/api/v1/furniture_makers/123456789012/score"

    expect(response).to have_http_status(:unauthorized)
    body = JSON.parse(response.body)
    expect(body.dig("error", "code")).to eq("unauthorized")
  end

  it "returns forbidden for role without access" do
    get "/api/v1/furniture_makers/123456789012/score", headers: api_headers_for(:customer)

    expect(response).to have_http_status(:forbidden)
    expect(JSON.parse(response.body).dig("error", "code")).to eq("forbidden")
  end

  it "returns insufficient_data true for sparse history" do
    sparse_maker = FurnitureMaker.create!(name: "Sparse", bin_iin: "987654321098")
    sparse_maker.orders.create!(title: "Single", status: :completed, total_price: 10_000, updated_at: Time.current)

    get "/api/v1/furniture_makers/987654321098/score", headers: headers

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["insufficient_data"]).to eq(true)
  end
end
