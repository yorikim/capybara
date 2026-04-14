require 'rails_helper'

RSpec.describe FurnitureMaker, type: :model do
  it "validates bin_iin presence and format" do
    maker = described_class.new(name: "Maker")

    expect(maker).not_to be_valid
    expect(maker.errors[:bin_iin]).to be_present
  end

  it "accepts only 12 digits bin_iin" do
    maker = described_class.new(name: "Maker", bin_iin: "abc")

    expect(maker).not_to be_valid
    expect(maker.errors[:bin_iin]).to be_present
  end

  it "validates unique bin_iin" do
    described_class.create!(name: "Maker1", bin_iin: "123456789012")
    duplicate = described_class.new(name: "Maker2", bin_iin: "123456789012")

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:bin_iin]).to include("has already been taken")
  end
end
