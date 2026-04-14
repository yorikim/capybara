module Api
  module V1
    class FurnitureMakersController < BaseController
      before_action -> { authorize_roles!(:production_staff, :admin) }

      def score
        maker = FurnitureMaker.find_by!(bin_iin: params[:bin_iin])
        result = FurnitureMakerScoreCalculator.new(furniture_maker: maker).call

        AuditLog.create!(
          furniture_maker: maker,
          action: "score_requested",
          details: { bin_iin: params[:bin_iin], score: result.score }
        )

        render json: result.to_h
      rescue ActiveRecord::RecordNotFound
        AuditLog.create!(action: "score_error", error_message: "maker_not_found", details: { bin_iin: params[:bin_iin] })
        raise ApiError.new(code: "maker_not_found", message: "Furniture maker not found", status: :not_found)
      rescue StandardError => e
        AuditLog.create!(furniture_maker: maker, action: "score_error", error_message: e.message, details: { bin_iin: params[:bin_iin] }) if defined?(maker)
        raise
      end
    end
  end
end
