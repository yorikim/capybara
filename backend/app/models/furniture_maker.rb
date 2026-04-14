class FurnitureMaker < ApplicationRecord
  BIN_IIN_REGEX = /\A\d{12}\z/.freeze

  has_many :orders, dependent: :restrict_with_error
  has_many :audit_logs, dependent: :nullify

  validates :bin_iin, presence: true, uniqueness: true, format: { with: BIN_IIN_REGEX }
end
