class Rack::Attack
  throttle("api/ip", limit: 60, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/api/")
  end

  throttle("api/score/by_bin_iin", limit: 30, period: 1.minute) do |req|
    next unless req.path.match?(%r{\A/api/v1/furniture_makers/[^/]+/score\z})

    req.path.split("/")[5]
  end

  self.throttled_responder = lambda do |_request|
    body = {
      error: {
        code: "rate_limited",
        message: "Too many requests",
        details: {}
      }
    }.to_json

    [ 429, { "Content-Type" => "application/json" }, [ body ] ]
  end
end
