defmodule TimoWeb.Router do
  use TimoWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
    plug :fetch_session
  end

  scope "/api", TimoWeb do
    pipe_through :api
    resources "/users", UserController, only: [:create, :show]
    resources "/teams", TeamController, only: [:create, :show, :index, :update]
    resources "/members", MemberController, only: [:create, :update]
    delete "/logout", SessionController, :logout
    post "/session", SessionController, :create
    get "/verify", UserController, :verify_email
  end

  if Mix.env() == :dev do
    forward "/sent_emails", Bamboo.SentEmailViewerPlug
  end
end
