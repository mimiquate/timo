defmodule TimoWeb.SessionController do
  use TimoWeb, :controller

  def logout(conn, _params) do
    response = Phoenix.json_library().encode_to_iodata!(%{})

    conn
    |> fetch_session()
    |> delete_session("user_id")
    # ---- Pass mix test, resp_body="\"\"", ember parsing error
    # |> put_status(:no_content)
    # |> json("")
    # ---- Doesn't pass mix test
    # |> put_resp_header("content-type", "application/vnd.api+json")
    # |> resp(:no_content, '')
    # |> send_resp()
    # ---- What json function actually does, uses api+json in this one, ember parsing error
    # |> put_resp_header("content-type", "application/vnd.api+json")
    # |> send_resp(:no_content, response)
    # ---- Functions correctly but uses response 200 instead of 204
    |> put_resp_header("content-type", "application/vnd.api+json")
    |> resp(:ok, response)
    |> send_resp()
  end
end
