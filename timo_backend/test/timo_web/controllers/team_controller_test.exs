defmodule TimoWeb.TeamControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.Team

  @create_attrs %{name: "some name"}
  @update_attrs %{name: "some updated name"}
  @invalid_attrs %{name: nil}

  def fixture(:team) do
    {:ok, team} = API.create_team(@create_attrs)
    team
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
    conn = get conn, team_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "creates team and renders team when data is valid", %{conn: conn} do
    conn = post conn, team_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "team",
        "attributes" => @create_attrs,
        "relationships" => relationships
      }
    }
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get conn, team_path(conn, :show, id)
    data = json_response(conn, 200)["data"]
    assert data["id"] == id
    assert data["type"] == "team"
    assert data["attributes"]["name"] == @create_attrs.name
  end

  test "does not create team and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, team_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "team",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates chosen team and renders team when data is valid", %{conn: conn} do
    %Team{id: id} = team = fixture(:team)
    conn = put conn, team_path(conn, :update, team), %{
      "meta" => %{},
      "data" => %{
        "type" => "team",
        "id" => "#{team.id}",
        "attributes" => @update_attrs,
        "relationships" => relationships
      }
    }

    conn = get conn, team_path(conn, :show, id)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{id}"
    assert data["type"] == "team"
    assert data["attributes"]["name"] == @update_attrs.name
  end

  test "does not update chosen team and renders errors when data is invalid", %{conn: conn} do
    team = fixture(:team)
    conn = put conn, team_path(conn, :update, team), %{
      "meta" => %{},
      "data" => %{
        "type" => "team",
        "id" => "#{team.id}",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen team", %{conn: conn} do
    team = fixture(:team)
    conn = delete conn, team_path(conn, :delete, team)
    assert response(conn, 204)
    assert_error_sent 404, fn ->
      get conn, team_path(conn, :show, team)
    end
  end
end
