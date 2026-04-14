# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_14_102508) do
  create_table "acceptance_acts", force: :cascade do |t|
    t.datetime "accepted_at"
    t.datetime "created_at", null: false
    t.text "notes"
    t.integer "order_id", null: false
    t.string "signed_by"
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_acceptance_acts_on_order_id", unique: true
  end

  create_table "api_clients", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.string "api_token", null: false
    t.datetime "created_at", null: false
    t.string "customer_uid"
    t.integer "furniture_maker_id"
    t.string "name", null: false
    t.string "role", null: false
    t.datetime "updated_at", null: false
    t.index ["api_token"], name: "index_api_clients_on_api_token", unique: true
    t.index ["customer_uid"], name: "index_api_clients_on_customer_uid"
    t.index ["furniture_maker_id"], name: "index_api_clients_on_furniture_maker_id"
    t.index ["role"], name: "index_api_clients_on_role"
  end

  create_table "audit_logs", force: :cascade do |t|
    t.string "action", null: false
    t.datetime "created_at", null: false
    t.json "details"
    t.text "error_message"
    t.integer "furniture_maker_id"
    t.integer "order_id"
    t.datetime "updated_at", null: false
    t.index ["action"], name: "index_audit_logs_on_action"
    t.index ["furniture_maker_id"], name: "index_audit_logs_on_furniture_maker_id"
    t.index ["order_id"], name: "index_audit_logs_on_order_id"
  end

  create_table "change_requests", force: :cascade do |t|
    t.datetime "approved_at"
    t.datetime "created_at", null: false
    t.integer "order_id", null: false
    t.date "proposed_deadline_at"
    t.decimal "proposed_price", precision: 12, scale: 2
    t.text "rejected_reason"
    t.json "requested_changes"
    t.string "status", default: "pending", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_change_requests_on_order_id"
  end

  create_table "design_revisions", force: :cascade do |t|
    t.datetime "approved_at"
    t.datetime "created_at", null: false
    t.text "notes"
    t.integer "order_id", null: false
    t.string "status", default: "draft", null: false
    t.datetime "updated_at", null: false
    t.integer "version", null: false
    t.index ["order_id", "version"], name: "index_design_revisions_on_order_id_and_version", unique: true
    t.index ["order_id"], name: "index_design_revisions_on_order_id"
  end

  create_table "disputes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "order_id", null: false
    t.text "resolution_notes"
    t.datetime "resolved_at"
    t.string "status", default: "open", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_disputes_on_order_id", unique: true
  end

  create_table "estimates", force: :cascade do |t|
    t.decimal "amount", precision: 12, scale: 2, null: false
    t.datetime "approved_at"
    t.datetime "created_at", null: false
    t.integer "lead_time_days", null: false
    t.integer "order_id", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_estimates_on_order_id"
  end

  create_table "furniture_makers", force: :cascade do |t|
    t.string "bin_iin", null: false
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["bin_iin"], name: "index_furniture_makers_on_bin_iin", unique: true
  end

  create_table "measurements", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "measured_at"
    t.integer "order_id", null: false
    t.json "payload"
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_measurements_on_order_id"
  end

  create_table "milestones", force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.date "due_on"
    t.string "name"
    t.integer "order_id", null: false
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_milestones_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "customer_uid"
    t.date "deadline_at"
    t.integer "furniture_maker_id", null: false
    t.integer "status", default: 0, null: false
    t.string "title", null: false
    t.decimal "total_price", precision: 12, scale: 2
    t.datetime "updated_at", null: false
    t.index ["customer_uid"], name: "index_orders_on_customer_uid"
    t.index ["furniture_maker_id"], name: "index_orders_on_furniture_maker_id"
    t.index ["status"], name: "index_orders_on_status"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "comment"
    t.datetime "created_at", null: false
    t.integer "order_id", null: false
    t.integer "rating", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_reviews_on_order_id", unique: true
  end

  create_table "specifications", force: :cascade do |t|
    t.datetime "approved_at"
    t.datetime "created_at", null: false
    t.integer "order_id", null: false
    t.json "payload", default: {}, null: false
    t.datetime "updated_at", null: false
    t.integer "version", null: false
    t.index ["order_id", "version"], name: "index_specifications_on_order_id_and_version", unique: true
    t.index ["order_id"], name: "index_specifications_on_order_id"
  end

  add_foreign_key "acceptance_acts", "orders"
  add_foreign_key "api_clients", "furniture_makers"
  add_foreign_key "audit_logs", "furniture_makers"
  add_foreign_key "audit_logs", "orders"
  add_foreign_key "change_requests", "orders"
  add_foreign_key "design_revisions", "orders"
  add_foreign_key "disputes", "orders"
  add_foreign_key "estimates", "orders"
  add_foreign_key "measurements", "orders"
  add_foreign_key "milestones", "orders"
  add_foreign_key "orders", "furniture_makers"
  add_foreign_key "reviews", "orders"
  add_foreign_key "specifications", "orders"
end
