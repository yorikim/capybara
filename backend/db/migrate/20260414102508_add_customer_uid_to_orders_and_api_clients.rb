class AddCustomerUidToOrdersAndApiClients < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :customer_uid, :string
    add_column :api_clients, :customer_uid, :string

    add_index :orders, :customer_uid
    add_index :api_clients, :customer_uid
  end
end
