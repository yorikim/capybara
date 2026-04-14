module Api
  module V1
    class AcceptanceActsController < BaseController
      before_action -> { authorize_roles!(:customer, :furniture_maker, :admin) }

      def create
        order = scope_orders_by_actor(Order).find(params[:order_id])
        authorize_order_access!(order)
        act = order.create_acceptance_act!(acceptance_act_params)
        order.transition_to!(:completed) if order.awaiting_acceptance?
        render json: { data: act.as_json }, status: :created
      end

      private

      def acceptance_act_params
        params.require(:acceptance_act).permit(:accepted_at, :notes, :signed_by)
      end
    end
  end
end
