defmodule TimoWeb.SessionController do
  use TimoWeb, :controller

  def logout(conn, _params) do
    conn
    |> fetch_session()
    |> delete_session("user_id")
    # |> put_status(:no_content)
    # |> json("")
    |> put_resp_header("content-type", "application/json")
    |> resp(:no_content, "")
    |> send_resp()
  end
end
