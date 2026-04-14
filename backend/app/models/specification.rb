class Specification < ApplicationRecord
  belongs_to :order

  validates :version, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :payload, presence: true
  validates :version, uniqueness: { scope: :order_id }
  validate :version_sequence_after_approval
  validate :immutable_when_approved, on: :update

  private

  def version_sequence_after_approval
    return unless order
    return if version.blank?

    last_version = order.specifications.where.not(id: id).maximum(:version) || 0
    expected_version = last_version + 1
    return if version == expected_version

    errors.add(:version, "must be #{expected_version} for next revision")
  end

  def immutable_when_approved
    return unless approved_at.present?
    return unless will_save_change_to_payload? || will_save_change_to_version? || will_save_change_to_approved_at?

    errors.add(:base, "Approved specification is immutable; create a new version instead")
  end
end
