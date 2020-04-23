defmodule TimoWeb.SessionControllerTest do
  import Plug.Test
  use TimoWeb.ConnCase

  alias Timo.API

  @create_attrs %{password: "password", username: "username", email: "email@timo"}
  @invalid_attrs %{password: "password2", username: "username", email: "email@timo"}

  @invalid_user_error [
    %{
      "status" => "400",
      "title" => "Invalid username or password",
      "detail" => "User doesn\'t exists or incorrect password"
    }
  ]

  setup %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end

  test "create session", %{conn: conn} do
    API.create_user(@create_attrs)
    conn = post(conn, Routes.session_path(conn, :create), @create_attrs)

    assert json_response(conn, 200)

    user_id =
      conn
      |> get_session("user_id")

    assert user_id
  end

  test "create session without existing username", %{conn: conn} do
    conn = post(conn, Routes.session_path(conn, :create), @create_attrs)

    assert response = json_response(conn, 400)
    assert response["errors"] == @invalid_user_error

    user_id =
      conn
      |> get_session("user_id")

    assert user_id == nil
  end

  test "create session with invalid password", %{conn: conn} do
    API.create_user(@create_attrs)
    conn = post(conn, Routes.session_path(conn, :create), @invalid_attrs)

    assert response = json_response(conn, 400)
    assert response["errors"] == @invalid_user_error

    user_id =
      conn
      |> get_session("user_id")

    assert user_id == nil
  end

  describe "test with already existing session" do
    setup %{conn: conn} do
      user = user_factory()

      conn =
        conn
        |> init_test_session(user_id: user.id)
        |> put_req_header("accept", "application/vnd.api+json")
        |> put_req_header("content-type", "application/vnd.api+json")

      {:ok, conn: conn}
    end

    test "logouts current session", %{conn: conn} do
      conn = delete(conn, Routes.session_path(conn, :logout))

      assert json_response(conn, 200)

      user_id =
        conn
        |> get_session("user_id")

      assert user_id == nil
    end
  end
end
