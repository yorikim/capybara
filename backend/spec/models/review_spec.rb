require 'rails_helper'

RSpec.describe Review, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "validates rating range" do
    review = described_class.new(order: order, rating: 10)
    expect(review).not_to be_valid
  end
end
