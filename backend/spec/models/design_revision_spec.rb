require 'rails_helper'

RSpec.describe DesignRevision, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "validates status and version" do
    revision = described_class.new(order: order, status: "invalid", version: 0)
    expect(revision).not_to be_valid
  end
end
