class CreateAcceptanceActs < ActiveRecord::Migration[8.1]
  def change
    create_table :acceptance_acts do |t|
      t.references :order, null: false, foreign_key: true, index: { unique: true }
      t.datetime :accepted_at
      t.text :notes
      t.string :signed_by

      t.timestamps
    end
  end
end
