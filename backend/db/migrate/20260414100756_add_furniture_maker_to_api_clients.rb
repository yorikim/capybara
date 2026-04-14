class AddFurnitureMakerToApiClients < ActiveRecord::Migration[8.1]
  def change
    add_reference :api_clients, :furniture_maker, null: true, foreign_key: true
  end
end
