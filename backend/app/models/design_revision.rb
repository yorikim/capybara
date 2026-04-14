class DesignRevision < ApplicationRecord
  belongs_to :order

  STATUSES = %w[draft approved rejected].freeze

  validates :version, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :status, inclusion: { in: STATUSES }
  validates :version, uniqueness: { scope: :order_id }
end
