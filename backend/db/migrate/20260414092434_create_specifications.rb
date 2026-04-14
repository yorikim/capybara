class CreateSpecifications < ActiveRecord::Migration[8.1]
  def change
    create_table :specifications do |t|
      t.references :order, null: false, foreign_key: true
      t.integer :version, null: false
      t.json :payload, null: false, default: {}
      t.datetime :approved_at

      t.timestamps
    end

    add_index :specifications, [:order_id, :version], unique: true
  end
end
