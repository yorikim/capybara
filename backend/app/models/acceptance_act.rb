class AcceptanceAct < ApplicationRecord
  belongs_to :order

  validates :accepted_at, presence: true
end
