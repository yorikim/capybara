require 'rails_helper'

RSpec.describe Measurement, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "requires payload and measured_at" do
    measurement = described_class.new(order: order)
    expect(measurement).not_to be_valid
  end
end
