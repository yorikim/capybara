require 'rails_helper'

RSpec.describe ChangeRequest, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order A", total_price: 10_000, deadline_at: Date.current + 10.days) }

  it "requires proposed commercial changes" do
    change_request = described_class.new(order: order, status: "pending")

    expect(change_request).not_to be_valid
    expect(change_request.errors[:base]).to include("Change request must include proposed price or deadline")
  end

  it "applies approved change request to order" do
    order.specifications.create!(version: 1, payload: { base: true }, approved_at: Time.current)
    change_request = described_class.create!(order: order, status: "pending", proposed_price: 15_000)

    change_request.approve!

    expect(order.reload.total_price.to_i).to eq(15_000)
    expect(change_request.reload.status).to eq("approved")
  end
end
