require 'rails_helper'

RSpec.describe Milestone, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "requires name and status" do
    milestone = described_class.new(order: order)
    expect(milestone).not_to be_valid
  end
end
