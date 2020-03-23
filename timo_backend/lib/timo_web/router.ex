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
    resources "/teams", TeamController, only: [:create, :show, :index]
    resources "/members", MemberController, only: [:create, :show, :update]
    delete "/logout", SessionController, :logout
  end
end
