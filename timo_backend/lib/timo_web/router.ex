defmodule TimoWeb.Router do
  use TimoWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TimoWeb do
    pipe_through :api
  end
end
