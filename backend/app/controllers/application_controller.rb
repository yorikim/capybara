class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound do |error|
    render_error("not_found", error.message, :not_found)
  end

  rescue_from ActiveRecord::RecordInvalid do |error|
    render_error("validation_error", error.record.errors.full_messages.join(", "), :unprocessable_entity, error.record.errors.to_hash)
  end

  rescue_from ApiError do |error|
    render_error(error.code, error.message, error.status, error.details)
  end

  private

  def render_error(code, message, status, details = {})
    render json: { error: { code: code, message: message, details: details || {} } }, status: status
  end
end
