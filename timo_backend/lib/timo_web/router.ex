defmodule TimoWeb.Router do
  use TimoWeb, :router

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
    plug :fetch_session
  end

  pipeline :slack do
    plug TimoWeb.Plug.SlackVerify
    plug :set_content_type_to_json
    plug :accepts, ["json"]
  end

  scope "/api", TimoWeb do
    pipe_through :api
    resources "/users", UserController, only: [:create, :show, :update]
    resources "/teams", TeamController, only: [:create, :show, :index, :update, :delete]
    resources "/members", MemberController, only: [:create, :update, :delete]
    delete "/logout", SessionController, :logout
    post "/session", SessionController, :create
  end

  scope "/slack", TimoWeb do
    get "/auth", SlackController, :auth
  end

  scope "/slack", TimoWeb do
    if Mix.env() !== :test do
      pipe_through :slack
    end

    post "/interactions", SlackController, :handle_request
  end

  forward "/sent_emails", Bamboo.SentEmailViewerPlug

  defp set_content_type_to_json(conn, _opts) do
    put_resp_content_type(conn, "application/json")
  end
end
