defmodule TimoWeb.UserControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.User

  @create_attrs %{username: "some username"}
  @update_attrs %{username: "some updated username"}
  @invalid_attrs %{username: nil}

  def fixture(:user) do
    {:ok, user} = API.create_user(@create_attrs)
    user
  end

  
  defp relationships do
    %{}
  end

  setup %{conn: conn} do
    conn = conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")
      
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, user_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "creates user and renders user when data is valid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "attributes" => @create_attrs,
        "relationships" => relationships
      }
    }
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get conn, user_path(conn, :show, id)
    data = json_response(conn, 200)["data"]
    assert data["id"] == id
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @create_attrs.username
  end

  test "does not create user and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates chosen user and renders user when data is valid", %{conn: conn} do
    %User{id: id} = user = fixture(:user)
    conn = put conn, user_path(conn, :update, user), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "id" => "#{user.id}",
        "attributes" => @update_attrs,
        "relationships" => relationships
      }
    }

    conn = get conn, user_path(conn, :show, id)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{id}"
    assert data["type"] == "user"
    assert data["attributes"]["username"] == @update_attrs.username
  end

  test "does not update chosen user and renders errors when data is invalid", %{conn: conn} do
    user = fixture(:user)
    conn = put conn, user_path(conn, :update, user), %{
      "meta" => %{},
      "data" => %{
        "type" => "user",
        "id" => "#{user.id}",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen user", %{conn: conn} do
    user = fixture(:user)
    conn = delete conn, user_path(conn, :delete, user)
    assert response(conn, 204)
    assert_error_sent 404, fn ->
      get conn, user_path(conn, :show, user)
    end
  end
end
