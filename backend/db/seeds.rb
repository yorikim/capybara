maker = FurnitureMaker.find_or_create_by!(bin_iin: "123456789012") do |m|
  m.name = "MVP Maker"
end

[
  { name: "Admin Client", role: "admin", api_token: "admin-demo-token" },
  { name: "Production Client", role: "production_staff", api_token: "production-demo-token" },
  { name: "Customer Client", role: "customer", api_token: "customer-demo-token", customer_uid: "customer-demo-1" },
  { name: "Furniture Maker Client", role: "furniture_maker", api_token: "maker-demo-token", furniture_maker_id: maker.id }
].each do |attrs|
  client = ApiClient.find_or_initialize_by(api_token: attrs[:api_token])
  client.name = attrs[:name]
  client.role = attrs[:role]
  client.active = true
  client.furniture_maker_id = attrs[:furniture_maker_id]
  client.customer_uid = attrs[:customer_uid]
  client.save!
end

3.times do |idx|
  order = maker.orders.find_or_create_by!(title: "Seed order ##{idx + 1}") do |o|
    o.status = :completed
    o.total_price = 120_000 + (idx * 10_000)
    o.deadline_at = Date.current + 14.days
    o.customer_uid = "customer-demo-1"
  end

  order.create_review!(rating: 4 + (idx % 2), comment: "Seed review #{idx + 1}") unless order.review
end
