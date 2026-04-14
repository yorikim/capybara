class CreateDisputes < ActiveRecord::Migration[8.1]
  def change
    create_table :disputes do |t|
      t.references :order, null: false, foreign_key: true, index: { unique: true }
      t.string :status, null: false, default: "open"
      t.text :description
      t.datetime :resolved_at
      t.text :resolution_notes

      t.timestamps
    end
  end
end
