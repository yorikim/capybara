require 'rails_helper'

RSpec.describe AcceptanceAct, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order") }

  it "requires accepted_at" do
    act = described_class.new(order: order)
    expect(act).not_to be_valid
  end
end
