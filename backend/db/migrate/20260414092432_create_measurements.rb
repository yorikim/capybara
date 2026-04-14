class CreateMeasurements < ActiveRecord::Migration[8.1]
  def change
    create_table :measurements do |t|
      t.references :order, null: false, foreign_key: true
      t.datetime :measured_at
      t.json :payload

      t.timestamps
    end
  end
end
