defmodule TimoWeb.Plugs.SetCurrentUser do
  import Plug.Conn

  alias Timo.API

  def init(_params) do
  end

  def call(conn, _params) do
    {:ok, current_user} =
      conn
      |> fetch_session()
      |> get_session("user_id")
      |> API.get_user()

    conn
    |> assign(:current_user, current_user)
  end
end
