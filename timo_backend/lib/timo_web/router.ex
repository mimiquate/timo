defmodule TimoWeb.Router do
  use TimoWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {TimoWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json-api"]
    plug :fetch_session
    plug :fetch_current_user
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
  end

  scope "/", TimoWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  scope "/api", TimoWeb do
    pipe_through :api

    resources "/cities", CityController, only: [:index]
    resources "/users", UserController, only: [:create, :show, :update]
    resources "/teams", TeamController, only: [:create, :show, :index, :update, :delete]

    resources "/members", MemberController, only: [:create, :update, :delete]

    delete "/logout", SessionController, :logout
    post "/session", SessionController, :create
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:timo, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: TimoWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  def fetch_current_user(conn, _opts) do
    user_id = get_session(conn, "user_id")

    with %Timo.API.User{} = current_user <- Timo.API.get_user(user_id) do
      assign(conn, :current_user, current_user)
    else
      nil -> assign(conn, :current_user, nil)
    end
  end
end
