require 'rails_helper'

RSpec.describe Specification, type: :model do
  let(:maker) { FurnitureMaker.create!(name: "Maker", bin_iin: "123456789012") }
  let(:order) { Order.create!(furniture_maker: maker, title: "Order A") }

  it "enforces sequential versions" do
    order.specifications.create!(version: 1, payload: { base: true })
    specification = order.specifications.new(version: 3, payload: { changed: true })

    expect(specification).not_to be_valid
    expect(specification.errors[:version]).to include("must be 2 for next revision")
  end

  it "does not allow updates after approval" do
    specification = order.specifications.create!(version: 1, payload: { base: true }, approved_at: Time.current)
    specification.payload = { changed: true }

    expect(specification).not_to be_valid
    expect(specification.errors[:base]).to include("Approved specification is immutable; create a new version instead")
  end
end
