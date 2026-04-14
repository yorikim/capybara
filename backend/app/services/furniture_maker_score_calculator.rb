class FurnitureMakerScoreCalculator
  Result = Struct.new(:bin_iin, :score, :score_band, :components, :insufficient_data, :calculated_at, keyword_init: true)

  MIN_ORDERS_FOR_CONFIDENCE = 3

  def initialize(furniture_maker:)
    @furniture_maker = furniture_maker
  end

  def call
    completed_orders = @furniture_maker.orders.completed.order(updated_at: :desc)
    insufficient_data = completed_orders.count < MIN_ORDERS_FOR_CONFIDENCE

    components = {
      recency: recency_score(completed_orders.first),
      frequency: frequency_score(completed_orders),
      volume: volume_score(completed_orders),
      quality: quality_score
    }
    score = (components.values.sum / components.size.to_f).round

    Result.new(
      bin_iin: @furniture_maker.bin_iin,
      score: score,
      score_band: score_band(score),
      components: components,
      insufficient_data: insufficient_data,
      calculated_at: Time.current.iso8601
    )
  end

  private

  def recency_score(last_order)
    return 0 unless last_order

    age_days = (Time.current.to_date - last_order.updated_at.to_date).to_i
    [100 - age_days, 0].max
  end

  def frequency_score(completed_orders)
    count = completed_orders.where("updated_at >= ?", 180.days.ago).count
    [count * 20, 100].min
  end

  def volume_score(completed_orders)
    avg_amount = completed_orders.average(:total_price).to_f
    [[(avg_amount / 100_000.0 * 100).round, 0].max, 100].min
  end

  def quality_score
    avg_rating = @furniture_maker.orders.joins(:review).average("reviews.rating").to_f
    return 0 if avg_rating.zero?

    ((avg_rating / 5.0) * 100).round
  end

  def score_band(score)
    return "high" if score >= 75
    return "medium" if score >= 50

    "low"
  end
end
