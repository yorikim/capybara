module Api
  module V1
    class ReviewsController < BaseController
      before_action -> { authorize_roles!(:customer, :furniture_maker, :admin) }

      def create
        order = scope_orders_by_actor(Order).find(params[:order_id])
        authorize_order_access!(order)
        review = order.create_review!(review_params)
        render json: { data: review.as_json }, status: :created
      end

      private

      def review_params
        params.require(:review).permit(:rating, :comment)
      end
    end
  end
end
