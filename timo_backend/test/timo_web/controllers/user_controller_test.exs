defmodule TimoWeb.UserControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API

  @create_attrs %{username: "some username"}
  @invalid_attrs %{username: nil}

  def fixture(:user) do
    {:ok, user} = API.create_user(@create_attrs)
    user
  end

  def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@create_attrs)
        |> API.create_user()

      user
  end

  defp relationships() do
    %{}
  end

  setup %{conn: conn} do
    conn = conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")
      
    {:ok, conn: conn}
  end

  test "creates user and renders user when data is valid", %{conn: conn} do
    conn = post conn, Routes.user_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "attributes" => @create_attrs,
        "relationships" => relationships()
      }
    }
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get conn, Routes.user_path(conn, :show, id)
    data = json_response(conn, 200)["data"]
    assert data["id"] == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
  end

  test "does not create user and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, Routes.user_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "attributes" => @invalid_attrs,
        "relationships" => relationships()
      }
    }
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "attempts to create already existing user and renders valid data", %{conn: conn} do
    user = user_fixture()
    user_id = Integer.to_string(user.id)
    user_username = user.username

    conn = post(conn, Routes.user_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "attributes" => @create_attrs,
        "relationships" => relationships()
      }
    })
    assert %{"id" => id} = json_response(conn, 200)["data"]

    conn = get conn, Routes.user_path(conn, :show, id)
    data = json_response(conn, 200)["data"]

    assert data["id"] == id
    assert user_id == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
    assert user_username == @create_attrs.username
  end
end
