module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_api!
      attr_reader :current_api_client

      private

      def authenticate_api!
        token = request.headers["Authorization"].to_s.delete_prefix("Bearer ").strip
        raise ApiError.new(code: "unauthorized", message: "Authorization required", status: :unauthorized) if token.blank?

        legacy = ENV.fetch("API_AUTH_TOKEN", "capybara-dev-token")
        if ActiveSupport::SecurityUtils.secure_compare(token, legacy)
          @current_api_client = ApiClient.new(name: "legacy-admin", role: "admin", api_token: token, active: true)
          return
        end

        @current_api_client = ApiClient.find_by(api_token: token, active: true)
        return if @current_api_client

        raise ApiError.new(code: "unauthorized", message: "Invalid API token", status: :unauthorized)
      end

      def authorize_roles!(*roles)
        return if roles.map(&:to_s).include?(current_api_client.role)

        raise ApiError.new(
          code: "forbidden",
          message: "Role is not allowed to perform this action",
          status: :forbidden,
          details: { role: current_api_client.role, allowed_roles: roles.map(&:to_s) }
        )
      end

      def scope_orders_by_actor(scope)
        case current_api_client.role
        when "furniture_maker"
          return scope.none unless current_api_client.furniture_maker_id

          scope.where(furniture_maker_id: current_api_client.furniture_maker_id)
        when "customer"
          return scope.none unless current_api_client.customer_uid.present?

          scope.where(customer_uid: current_api_client.customer_uid)
        else
          scope
        end
      end

      def authorize_order_access!(order)
        if current_api_client.role == "furniture_maker"
          return if current_api_client.furniture_maker_id == order.furniture_maker_id
        elsif current_api_client.role == "customer"
          return if current_api_client.customer_uid.present? && current_api_client.customer_uid == order.customer_uid
        else
          return
        end

        raise ApiError.new(
          code: "forbidden",
          message: "Actor can access only own orders",
          status: :forbidden,
          details: { order_id: order.id }
        )
      end

      def paginate(scope)
        page = [params.fetch(:page, 1).to_i, 1].max
        per_page = params.fetch(:per_page, 20).to_i.clamp(1, 100)
        offset = (page - 1) * per_page

        total_count = scope.count
        records = scope.limit(per_page).offset(offset)
        pagination = {
          page: page,
          per_page: per_page,
          total_count: total_count,
          total_pages: (total_count.to_f / per_page).ceil
        }

        [records, pagination]
      end
    end
  end
end
