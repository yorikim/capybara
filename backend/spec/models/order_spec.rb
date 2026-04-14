require 'rails_helper'

RSpec.describe Order, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }

  it "allows configured status transitions" do
    order = described_class.create!(furniture_maker: maker, title: "Order A", status: :draft)

    expect(order.can_transition_to?(:published)).to be(true)
    expect(order.can_transition_to?(:completed)).to be(false)
  end

  it "prevents changing price directly after approved specification" do
    order = described_class.create!(furniture_maker: maker, title: "Order A", status: :published, total_price: 10_000)
    order.specifications.create!(version: 1, payload: { rooms: 2 }, approved_at: Time.current)

    order.total_price = 11_000
    expect(order).not_to be_valid
    expect(order.errors[:base]).to include("Price and deadline can be changed only via approved change request")
  end
end
