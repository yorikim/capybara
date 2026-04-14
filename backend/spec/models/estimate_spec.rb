require 'rails_helper'

RSpec.describe Estimate, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "validates amount and lead time" do
    estimate = described_class.new(order: order, amount: -1, lead_time_days: 0)

    expect(estimate).not_to be_valid
  end
end
