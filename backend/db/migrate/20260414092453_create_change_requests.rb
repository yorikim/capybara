class CreateChangeRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :change_requests do |t|
      t.references :order, null: false, foreign_key: true
      t.string :status, null: false, default: "pending"
      t.json :requested_changes
      t.decimal :proposed_price, precision: 12, scale: 2
      t.date :proposed_deadline_at
      t.datetime :approved_at
      t.text :rejected_reason

      t.timestamps
    end
  end
end
