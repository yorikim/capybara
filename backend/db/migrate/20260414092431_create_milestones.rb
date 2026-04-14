class CreateMilestones < ActiveRecord::Migration[8.1]
  def change
    create_table :milestones do |t|
      t.references :order, null: false, foreign_key: true
      t.string :name
      t.string :status
      t.date :due_on
      t.datetime :completed_at

      t.timestamps
    end
  end
end
