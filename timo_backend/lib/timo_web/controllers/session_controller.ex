defmodule TimoWeb.SessionController do
  use TimoWeb, :controller

  def logout(conn, _params) do
    response = Phoenix.json_library().encode_to_iodata!(%{})

    conn
    |> delete_session("user_id")
    |> put_resp_header("content-type", "application/vnd.api+json")
    |> resp(:ok, response)
    |> send_resp()
  end
end
