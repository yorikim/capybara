require "rails_helper"

RSpec.describe FurnitureMakerScoreCalculator, type: :service do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }

  it "returns high band for strong metrics" do
    4.times do |idx|
      order = maker.orders.create!(title: "Order #{idx}", status: :completed, total_price: 300_000, updated_at: idx.days.ago)
      order.create_review!(rating: 5, comment: "Great")
    end

    result = described_class.new(furniture_maker: maker).call

    expect(result.score).to be >= 75
    expect(result.score_band).to eq("high")
    expect(result.insufficient_data).to be(false)
  end

  it "marks insufficient_data when too few orders" do
    order = maker.orders.create!(title: "Order 1", status: :completed, total_price: 100_000, updated_at: Time.current)
    order.create_review!(rating: 3, comment: "Ok")

    result = described_class.new(furniture_maker: maker).call

    expect(result.insufficient_data).to be(true)
  end
end
