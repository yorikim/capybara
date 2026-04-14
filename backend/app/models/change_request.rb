class ChangeRequest < ApplicationRecord
  belongs_to :order

  STATUSES = %w[pending approved rejected].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :proposed_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :must_change_any_commercial_term

  def approve!
    transaction do
      order.allow_commercial_terms_change = true
      order.update!(
        total_price: proposed_price || order.total_price,
        deadline_at: proposed_deadline_at || order.deadline_at
      )
      update!(status: "approved", approved_at: Time.current)
    end
  end

  private

  def must_change_any_commercial_term
    return if proposed_price.present? || proposed_deadline_at.present?

    errors.add(:base, "Change request must include proposed price or deadline")
  end
end
