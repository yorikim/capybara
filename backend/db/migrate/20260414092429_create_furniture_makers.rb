class CreateFurnitureMakers < ActiveRecord::Migration[8.1]
  def change
    create_table :furniture_makers do |t|
      t.string :name
      t.string :bin_iin, null: false

      t.timestamps
    end
    add_index :furniture_makers, :bin_iin, unique: true
  end
end
