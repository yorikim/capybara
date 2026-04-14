class Estimate < ApplicationRecord
  belongs_to :order

  validates :amount, numericality: { greater_than_or_equal_to: 0 }, allow_nil: false
  validates :lead_time_days, numericality: { only_integer: true, greater_than: 0 }, allow_nil: false
end
