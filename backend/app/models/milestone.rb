class Milestone < ApplicationRecord
  belongs_to :order

  validates :name, presence: true
  validates :status, presence: true
end
