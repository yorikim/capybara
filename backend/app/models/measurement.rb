class Measurement < ApplicationRecord
  belongs_to :order

  validates :measured_at, presence: true
  validates :payload, presence: true
end
