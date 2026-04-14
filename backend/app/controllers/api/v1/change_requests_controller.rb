module Api
  module V1
    class ChangeRequestsController < BaseController
      before_action -> { authorize_roles!(:customer, :furniture_maker, :admin) }, only: %i[create]
      before_action -> { authorize_roles!(:production_staff, :admin) }, only: %i[approve]

      def create
        order = scope_orders_by_actor(Order).find(params[:order_id])
        authorize_order_access!(order)
        change_request = order.change_requests.create!(change_request_params)
        render json: { data: change_request.as_json }, status: :created
      end

      def approve
        change_request = ChangeRequest.find(params[:id])
        change_request.approve!
        render json: { data: change_request.reload.as_json }
      end

      private

      def change_request_params
        params.require(:change_request).permit(:proposed_price, :proposed_deadline_at, requested_changes: {})
      end
    end
  end
end
