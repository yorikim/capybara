class Order < ApplicationRecord
  belongs_to :furniture_maker

  has_many :milestones, dependent: :destroy
  has_many :measurements, dependent: :destroy
  has_many :design_revisions, dependent: :destroy
  has_many :specifications, dependent: :destroy
  has_many :estimates, dependent: :destroy
  has_many :change_requests, dependent: :destroy
  has_one :acceptance_act, dependent: :destroy
  has_one :dispute, dependent: :destroy
  has_one :review, dependent: :destroy
  has_many :audit_logs, dependent: :nullify

  enum :status, {
    draft: 0,
    published: 1,
    measuring: 2,
    designing: 3,
    awaiting_design_approval: 4,
    in_production: 5,
    ready_for_delivery: 6,
    installing: 7,
    awaiting_acceptance: 8,
    completed: 9,
    on_hold: 10,
    dispute: 11,
    cancelled: 12
  }, default: :draft

  TRANSITIONS = {
    draft: %i[published cancelled],
    published: %i[measuring on_hold cancelled],
    measuring: %i[designing on_hold cancelled],
    designing: %i[awaiting_design_approval on_hold cancelled],
    awaiting_design_approval: %i[in_production on_hold cancelled],
    in_production: %i[ready_for_delivery on_hold cancelled],
    ready_for_delivery: %i[installing on_hold cancelled],
    installing: %i[awaiting_acceptance on_hold dispute cancelled],
    awaiting_acceptance: %i[completed dispute on_hold],
    completed: [],
    on_hold: %i[published measuring designing awaiting_design_approval in_production ready_for_delivery installing awaiting_acceptance dispute cancelled],
    dispute: %i[on_hold awaiting_acceptance cancelled],
    cancelled: []
  }.freeze

  attr_accessor :allow_commercial_terms_change

  validates :title, presence: true
  validates :total_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :commercial_terms_change_allowed, on: :update

  def can_transition_to?(target_status)
    TRANSITIONS.fetch(status.to_sym, []).include?(target_status.to_sym)
  end

  def transition_to!(target_status)
    target = target_status.to_sym
    raise ApiError.new(code: "invalid_transition", message: "Invalid status transition", status: :unprocessable_entity, details: { from: status, to: target }) unless can_transition_to?(target)

    update!(status: target)
  end

  def specification_approved?
    specifications.where.not(approved_at: nil).exists?
  end

  private

  def commercial_terms_change_allowed
    return unless specification_approved?
    return unless will_save_change_to_total_price? || will_save_change_to_deadline_at?
    return if ActiveModel::Type::Boolean.new.cast(allow_commercial_terms_change)

    errors.add(:base, "Price and deadline can be changed only via approved change request")
  end
end
