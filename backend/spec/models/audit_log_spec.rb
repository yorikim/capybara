require 'rails_helper'

RSpec.describe AuditLog, type: :model do
  it "requires action" do
    log = described_class.new
    expect(log).not_to be_valid
  end
end
