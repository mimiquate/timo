defmodule TimoWeb.Router do
  use TimoWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
  end

  scope "/api", TimoWeb do
    pipe_through :api
    resources "/users", UserController, only: [:create, :show]
    resources "/teams", TeamController, except: [:new, :edit]
  end
end
