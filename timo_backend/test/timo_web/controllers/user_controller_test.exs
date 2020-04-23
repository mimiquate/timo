defmodule TimoWeb.UserControllerTest do
  import Plug.Test
  use TimoWeb.ConnCase

  @create_attrs %{username: "some username", password: "some_password", email: "email@timo"}
  @invalid_attrs %{username: nil, password: nil, email: nil}
  @invalid_space_attrs %{username: " ", password: " ", email: " "}
  @invalid_length_username %{username: "123", password: "some_password", email: "email@timo"}
  @invalid_length_password %{username: "some username", password: "1234567", email: "email@timo"}

  def data_fixture(attribute) do
    %{
      "meta" => %{},
      "data" => %{
        "type" => "users",
        "attributes" => attribute,
        "relationships" => relationships()
      }
    }
  end

  defp relationships() do
    %{}
  end

  setup %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end

  test "creates user and renders user when data is valid", %{conn: conn} do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@create_attrs))
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get(conn, Routes.user_path(conn, :show, id))
    data = json_response(conn, 200)["data"]

    assert data["id"] == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
  end

  test "does not create user and renders errors when data is invalid", %{conn: conn} do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@invalid_attrs))

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "does not create user and renders errors when username length is less than 4", %{
    conn: conn
  } do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@invalid_length_username))

    assert json_response(conn, 422)["errors"] == %{
             "username" => ["should be at least 4 character(s)"]
           }
  end

  test "does not create user and renders errors when password length is less than 8", %{
    conn: conn
  } do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@invalid_length_password))

    assert json_response(conn, 422)["errors"] == %{
             "password" => ["should be at least 8 character(s)"]
           }
  end

  test "attempts to create already existing user", %{conn: conn} do
    user_factory()

    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@create_attrs))

    assert json_response(conn, 422)["errors"] == %{"username" => ["has already been taken"]}
  end

  test "does not create user and renders errors when data is just whitespace", %{conn: conn} do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@invalid_space_attrs))

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "show user that exist", %{conn: conn} do
    user = user_factory()
    user_id = Integer.to_string(user.id)

    conn = get(conn, Routes.user_path(conn, :show, user_id))
    data = json_response(conn, 200)["data"]

    assert data["id"] == user_id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == user.username
  end

  test "does not show user with id: me when cookies where not updated", %{conn: conn} do
    conn = get(conn, Routes.user_path(conn, :show, "me"))
    assert json_response(conn, 401)["errors"] != %{}
  end

  test "does not show user that doesn't exist", %{conn: conn} do
    conn = get(conn, Routes.user_path(conn, :show, 100))
    assert json_response(conn, 404)["errors"] != %{}
  end

  test "attempts to create user with already existing email", %{conn: conn} do
    user_factory(%{username: "username", password: "password", email: "email@timo"})

    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@create_attrs))

    assert json_response(conn, 422)["errors"] == %{"email" => ["has already been taken"]}
  end

  describe "testing session show" do
    setup %{conn: conn} do
      user = user_factory()

      conn =
        conn
        |> init_test_session(user_id: user.id)
        |> put_req_header("accept", "application/vnd.api+json")
        |> put_req_header("content-type", "application/vnd.api+json")

      {:ok, conn: conn, user: user}
    end

    test "shows user with id: me in the session's cookie", %{conn: conn, user: user} do
      user_id = Integer.to_string(user.id)

      conn = get(conn, Routes.user_path(conn, :show, "me"))
      data = json_response(conn, 200)["data"]

      assert data["id"] == user_id
      assert data["type"] == "user"
      assert data["attributes"]["username"] == user.username
    end
  end
end
