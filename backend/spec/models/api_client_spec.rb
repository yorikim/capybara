require 'rails_helper'

RSpec.describe ApiClient, type: :model do
  it "validates role inclusion" do
    client = described_class.new(name: "Client", role: "wrong", api_token: "token")
    expect(client).not_to be_valid
  end

  it "validates api_token uniqueness" do
    described_class.create!(name: "A", role: "admin", api_token: "same-token")
    duplicate = described_class.new(name: "B", role: "admin", api_token: "same-token")
    expect(duplicate).not_to be_valid
  end

  it "requires furniture_maker for furniture_maker role" do
    client = described_class.new(name: "Maker Client", role: "furniture_maker", api_token: "maker-token")

    expect(client).not_to be_valid
    expect(client.errors[:furniture_maker]).to include("must be set for furniture_maker role")
  end

  it "requires customer_uid for customer role" do
    client = described_class.new(name: "Customer Client", role: "customer", api_token: "customer-token")

    expect(client).not_to be_valid
    expect(client.errors[:customer_uid]).to include("must be set for customer role")
  end
end
