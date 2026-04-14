class Dispute < ApplicationRecord
  belongs_to :order

  STATUSES = %w[open in_review resolved rejected].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :description, presence: true
end
