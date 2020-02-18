defmodule TimoWeb.SessionControllerTest do
  import Plug.Test
  use TimoWeb.ConnCase

  setup %{conn: conn} do
    user = user_factory()

    conn =
      conn
      |> init_test_session(user_id: user.id)
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn, user: user}
  end

  test "logouts current session", %{conn: conn} do
    conn = delete(conn, Routes.session_path(conn, :logout))

    assert json_response(conn, 200)

    user_id =
      conn
      |> fetch_session()
      |> get_session("user_id")

    assert user_id == nil
  end
end
