class CreateEstimates < ActiveRecord::Migration[8.1]
  def change
    create_table :estimates do |t|
      t.references :order, null: false, foreign_key: true
      t.decimal :amount, precision: 12, scale: 2, null: false
      t.integer :lead_time_days, null: false
      t.datetime :approved_at

      t.timestamps
    end
  end
end
