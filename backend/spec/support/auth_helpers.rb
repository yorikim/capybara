require "securerandom"

module AuthHelpers
  def api_headers_for(role, furniture_maker: nil, customer_uid: nil)
    maker = furniture_maker
    if role.to_s == "furniture_maker" && maker.nil?
      bin_iin = loop do
        value = format("%012d", SecureRandom.random_number(10**12))
        break value unless FurnitureMaker.exists?(bin_iin: value)
      end
      maker = FurnitureMaker.create!(name: "Scoped Maker", bin_iin: bin_iin)
    end
    customer = customer_uid
    customer = "customer-#{SecureRandom.hex(4)}" if role.to_s == "customer" && customer.blank?

    client = ApiClient.create!(
      name: "#{role}-client",
      role: role.to_s,
      api_token: "#{role}-token-#{SecureRandom.hex(4)}",
      active: true,
      furniture_maker: maker,
      customer_uid: customer
    )
    { "Authorization" => "Bearer #{client.api_token}" }
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
