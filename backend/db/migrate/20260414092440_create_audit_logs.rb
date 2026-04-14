class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.references :furniture_maker, null: true, foreign_key: true
      t.references :order, null: true, foreign_key: true
      t.string :action, null: false
      t.json :details
      t.text :error_message

      t.timestamps
    end

    add_index :audit_logs, :action
  end
end
