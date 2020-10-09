defmodule TimoWeb.Plugs.AuthenticateCurrentUser do
  @behaviour Plug

  import Plug.Conn
  import Phoenix.Controller

  def init(_params) do
  end

  def call(conn, _params) do
    if !conn.assigns.current_user do
      conn
      |> put_status(:unauthorized)
      |> put_view(TimoWeb.ErrorView)
      |> render(:"401")
    else
      conn
    end
  end
end
