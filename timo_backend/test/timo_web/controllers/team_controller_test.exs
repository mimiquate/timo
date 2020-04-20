defmodule TimoWeb.TeamControllerTest do
  import Plug.Test
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.Team

  @create_attrs %{name: "some name", public: false, share_id: nil}
  @invalid_attrs %{name: nil, public: nil, share_id: nil}

  def data_fixture(attribute) do
    %{
      "meta" => %{},
      "data" => %{
        "type" => "teams",
        "attributes" => attribute,
        "relationships" => relationships()
      }
    }
  end

  defp relationships() do
    %{}
  end

  setup %{conn: conn} do
    user = user_factory()

    conn =
      conn
      |> init_test_session(user_id: user.id)
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn, user: user}
  end

  test "lists all entries on index", %{conn: conn, user: user} do
    team1 = team_factory(user)
    team2 = team_factory(user)
    conn = get(conn, Routes.team_path(conn, :index))

    [data1, data2 | []] = json_response(conn, 200)["data"]

    assert data1["type"] == "team"
    assert data2["type"] == "team"
    assert Integer.to_string(team1.id) == data1["id"]
    assert Integer.to_string(team2.id) == data2["id"]

    teams_in_db = API.list_user_teams(user)
    assert teams_in_db == [team1, team2]
  end

  test "lists empty entries on index", %{conn: conn} do
    conn = get(conn, Routes.team_path(conn, :index))

    assert json_response(conn, 200)["data"] == []
  end

  test "creates team and renders team when data is valid", %{conn: conn, user: user} do
    conn = post(conn, Routes.team_path(conn, :create), data_fixture(@create_attrs))

    assert data = json_response(conn, 201)["data"]
    assert data["type"] == "team"
    assert data["attributes"]["name"] == @create_attrs.name

    {:ok, %Team{} = team} = API.get_user_team(user, data["id"])

    assert Integer.to_string(team.id) == data["id"]
    assert team.user_id == user.id
    assert team.name == data["attributes"]["name"]
  end

  test "does not create team and renders errors when data is invalid", %{conn: conn} do
    conn = post(conn, Routes.team_path(conn, :create), data_fixture(@invalid_attrs))
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "show team of user", %{conn: conn, user: user} do
    team = team_factory(user)
    team_id = Integer.to_string(team.id)
    conn = get(conn, Routes.team_path(conn, :show, team_id))
    data = json_response(conn, 200)["data"]

    assert data["id"] == team_id
    assert data["type"] == "team"
    assert data["attributes"]["name"] == @create_attrs.name
  end

  test "does not show team that doesn't exist", %{conn: conn} do
    conn = get(conn, Routes.team_path(conn, :show, 100))

    assert json_response(conn, 404)["errors"] != %{}
  end

  test "does not show existing team but doesn't belong to current user", %{conn: conn} do
    owner = Timo.Repo.insert!(%Timo.API.User{username: "some other user"})
    team = team_factory(owner)

    conn = get(conn, Routes.team_path(conn, :show, team.id))

    assert json_response(conn, 404)["errors"] != %{}
  end
end
