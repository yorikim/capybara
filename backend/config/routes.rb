Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get "furniture_makers/:bin_iin/score", to: "furniture_makers#score"

      resources :orders, only: %i[index show create] do
        member do
          patch :transition
        end

        resources :change_requests, only: %i[create]
        resource :acceptance_act, only: %i[create]
        resource :review, only: %i[create]
      end

      resources :change_requests, only: [] do
        member do
          patch :approve
        end
      end
    end
  end
end
