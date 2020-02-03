defmodule TimoWeb.MemberControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.Member

  @create_attrs %{name: "some name", timezone: "some timezone"}
  @update_attrs %{name: "some updated name", timezone: "some updated timezone"}
  @invalid_attrs %{name: nil, timezone: nil}

  def fixture(:member) do
    {:ok, member} = API.create_member(@create_attrs)
    member
  end

  defp relationships do
    %{}
  end

  setup %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get(conn, Routes.member_path(conn, :index))
    assert json_response(conn, 200)["data"] == []
  end

  test "creates member and renders member when data is valid", %{conn: conn} do
    conn =
      post conn, Routes.member_path(conn, :create), %{
        "meta" => %{},
        "data" => %{
          "type" => "member",
          "attributes" => @create_attrs,
          "relationships" => relationships
        }
      }

    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get(conn, Routes.member_path(conn, :show, id))
    data = json_response(conn, 200)["data"]
    assert data["id"] == id
    assert data["type"] == "member"
    assert data["attributes"]["name"] == @create_attrs.name
    assert data["attributes"]["timezone"] == @create_attrs.timezone
  end

  test "does not create member and renders errors when data is invalid", %{conn: conn} do
    conn =
      post conn, Routes.member_path(conn, :create), %{
        "meta" => %{},
        "data" => %{
          "type" => "member",
          "attributes" => @invalid_attrs,
          "relationships" => relationships
        }
      }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates chosen member and renders member when data is valid", %{conn: conn} do
    %Member{id: id} = member = fixture(:member)

    conn =
      put conn, Routes.member_path(conn, :update, member), %{
        "meta" => %{},
        "data" => %{
          "type" => "member",
          "id" => "#{member.id}",
          "attributes" => @update_attrs,
          "relationships" => relationships
        }
      }

    conn = get(conn, Routes.member_path(conn, :show, id))
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{id}"
    assert data["type"] == "member"
    assert data["attributes"]["name"] == @update_attrs.name
    assert data["attributes"]["timezone"] == @update_attrs.timezone
  end

  test "does not update chosen member and renders errors when data is invalid", %{conn: conn} do
    member = fixture(:member)

    conn =
      put conn, Routes.member_path(conn, :update, member), %{
        "meta" => %{},
        "data" => %{
          "type" => "member",
          "id" => "#{member.id}",
          "attributes" => @invalid_attrs,
          "relationships" => relationships
        }
      }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen member", %{conn: conn} do
    member = fixture(:member)
    conn = delete(conn, Routes.member_path(conn, :delete, member))
    assert response(conn, 204)

    assert_error_sent 404, fn ->
      get(conn, Routes.member_path(conn, :show, member))
    end
  end
end
