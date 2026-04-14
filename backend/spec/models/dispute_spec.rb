require 'rails_helper'

RSpec.describe Dispute, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "requires valid status" do
    dispute = described_class.new(order: order, status: "wrong", description: "Issue")
    expect(dispute).not_to be_valid
  end
end
