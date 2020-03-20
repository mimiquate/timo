defmodule TimoWeb.SessionController do
  use TimoWeb, :controller

  def logout(conn, _params) do
    conn
    |> delete_session("user_id")
    |> json(%{})
  end
end
