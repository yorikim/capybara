class ApiClient < ApplicationRecord
  ROLES = %w[customer furniture_maker production_staff admin].freeze
  belongs_to :furniture_maker, optional: true

  validates :name, presence: true
  validates :api_token, presence: true, uniqueness: true
  validates :role, inclusion: { in: ROLES }
  validate :furniture_maker_required_for_furniture_role
  validate :customer_uid_required_for_customer_role

  private

  def furniture_maker_required_for_furniture_role
    return unless role == "furniture_maker"
    return if furniture_maker_id.present?

    errors.add(:furniture_maker, "must be set for furniture_maker role")
  end

  def customer_uid_required_for_customer_role
    return unless role == "customer"
    return if customer_uid.present?

    errors.add(:customer_uid, "must be set for customer role")
  end
end
