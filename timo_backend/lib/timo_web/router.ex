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
    resources "/users", UserController, only: [:create, :show, :update]
    resources "/teams", TeamController, only: [:create, :show, :index, :update, :delete]
    resources "/members", MemberController, only: [:create, :update, :delete, :index]
    delete "/logout", SessionController, :logout
    post "/session", SessionController, :create
  end

  forward "/sent_emails", Bamboo.SentEmailViewerPlug
end
