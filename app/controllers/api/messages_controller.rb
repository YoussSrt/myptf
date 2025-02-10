module Api
  class MessagesController < ApplicationController
    def create
      # TODO: Implement actual email sending logic
      if valid_message_params?
        render json: { status: "success", message: "Message sent successfully!" }
      else
        render json: { status: "error", message: "Please fill in all required fields." }, status: :unprocessable_entity
      end
    end

    private

    def valid_message_params?
      params[:name].present? && params[:email].present? && params[:message].present?
    end

    def message_params
      params.permit(:name, :email, :subject, :message)
    end
  end
end
