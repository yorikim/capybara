class AuditLog < ApplicationRecord
  belongs_to :furniture_maker, optional: true
  belongs_to :order, optional: true

  validates :action, presence: true
end
