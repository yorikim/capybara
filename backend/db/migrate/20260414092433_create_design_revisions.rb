class CreateDesignRevisions < ActiveRecord::Migration[8.1]
  def change
    create_table :design_revisions do |t|
      t.references :order, null: false, foreign_key: true
      t.integer :version, null: false
      t.string :status, null: false, default: "draft"
      t.text :notes
      t.datetime :approved_at

      t.timestamps
    end

    add_index :design_revisions, [:order_id, :version], unique: true
  end
end
