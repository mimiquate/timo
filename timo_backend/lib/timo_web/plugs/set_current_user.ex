defmodule TimoWeb.Plugs.SetCurrentUser do
  @behaviour Plug

  import Plug.Conn

  alias Timo.API

  def init(_params) do
  end

  def call(conn, _params) do
    user_id = get_session(conn, "user_id")

    with {:ok, current_user} <- API.get_user(user_id) do
      assign(conn, :current_user, current_user)
    else
      nil -> assign(conn, :current_user, nil)
    end
  end
end
