defmodule TimoWeb.UserControllerTest do
  use TimoWeb.ConnCase

  @create_attrs %{username: "some username"}
  @invalid_attrs %{username: nil}
  @invalid_space_attrs %{username: " "}

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

  test "attempts to create already existing user and renders valid data", %{conn: conn} do
    user = user_fixture()
    user_id = Integer.to_string(user.id)
    user_username = user.username

    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@create_attrs))
    assert %{"id" => id} = json_response(conn, 200)["data"]

    conn = get(conn, Routes.user_path(conn, :show, id))
    data = json_response(conn, 200)["data"]

    assert data["id"] == id
    assert user_id == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
    assert user_username == @create_attrs.username
  end

  test "does not create user and renders errors when data is just whitespace", %{conn: conn} do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@invalid_space_attrs))

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "show user that exist", %{conn: conn} do
    user = user_fixture()
    user_id = Integer.to_string(user.id)

    conn = get(conn, Routes.user_path(conn, :show, user_id))
    data = json_response(conn, 200)["data"]

    assert data["id"] == user_id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == user.username
  end

  test "shows user with id: me in the session's cookie", %{conn: conn} do
    conn = post(conn, Routes.user_path(conn, :create), data_fixture(@create_attrs))
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get(conn, Routes.user_path(conn, :show, "me"))
    data = json_response(conn, 200)["data"]

    assert data["id"] == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
  end

  test "does not show user with id: me when cookies where not updated", %{conn: conn} do
    conn = get(conn, Routes.user_path(conn, :show, "me"))
    assert json_response(conn, 404)["errors"] != %{}
  end

  test "does not show user that doesn't exist", %{conn: conn} do
    conn = get(conn, Routes.user_path(conn, :show, 100))
    assert json_response(conn, 404)["errors"] != %{}
  end
end
