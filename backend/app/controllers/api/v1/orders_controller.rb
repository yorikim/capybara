module Api
  module V1
    class OrdersController < BaseController
      before_action -> { authorize_roles!(:customer, :furniture_maker, :production_staff, :admin) }, only: %i[index show]
      before_action -> { authorize_roles!(:customer, :furniture_maker, :admin) }, only: %i[create]
      before_action -> { authorize_roles!(:furniture_maker, :production_staff, :admin) }, only: %i[transition]

      def index
        scoped = scope_orders_by_actor(Order.includes(:furniture_maker).order(created_at: :desc))
        orders, pagination = paginate(scoped)

        render json: {
          data: orders.map { |order| order_payload(order) },
          pagination: pagination
        }
      end

      def show
        order = scope_orders_by_actor(Order).find(params[:id])
        render json: { data: order_payload(order, include_details: true) }
      end

      def create
        attrs = order_params.to_h
        if current_api_client.role == "furniture_maker"
          attrs["furniture_maker_id"] = current_api_client.furniture_maker_id
        elsif current_api_client.role == "customer"
          attrs["customer_uid"] = current_api_client.customer_uid
        end
        order = Order.create!(attrs)
        render json: { data: order_payload(order) }, status: :created
      end

      def transition
        order = scope_orders_by_actor(Order).find(params[:id])
        authorize_order_access!(order)
        order.transition_to!(params.require(:to_status))
        render json: { data: order_payload(order) }
      end

      private

      def order_params
        params.require(:order).permit(:furniture_maker_id, :title, :total_price, :deadline_at, :status, :customer_uid)
      end

      def order_payload(order, include_details: false)
        payload = {
          id: order.id,
          title: order.title,
          status: order.status,
          customer_uid: order.customer_uid,
          total_price: order.total_price&.to_f,
          deadline_at: order.deadline_at,
          furniture_maker: {
            id: order.furniture_maker.id,
            name: order.furniture_maker.name,
            bin_iin: order.furniture_maker.bin_iin
          }
        }
        return payload unless include_details

        payload.merge(
          milestones: order.milestones.order(:created_at).as_json(only: %i[id name status due_on completed_at]),
          measurements: order.measurements.order(:created_at).as_json(only: %i[id measured_at payload]),
          specifications: order.specifications.order(:version).as_json(only: %i[id version payload approved_at]),
          change_requests: order.change_requests.order(:created_at).as_json(only: %i[id status proposed_price proposed_deadline_at approved_at])
        )
      end
    end
  end
end
