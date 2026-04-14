class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :furniture_maker, null: false, foreign_key: true
      t.integer :status, null: false, default: 0
      t.decimal :total_price, precision: 12, scale: 2
      t.date :deadline_at
      t.string :title, null: false

      t.timestamps
    end

    add_index :orders, :status
  end
end
