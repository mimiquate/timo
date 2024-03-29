defmodule TimoWeb.TeamControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.Team

  @create_attrs %{name: "some name"}
  @invalid_attrs %{name: nil, public: nil}
  @update_attrs %{name: "some name updated", public: true}

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
    team2 = team_factory(user, %{share_id: "unique_id_2"})
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

  test "updates team and renders team when data is valid", %{conn: conn, user: user} do
    team = team_factory(user)
    team_id = Integer.to_string(team.id)

    conn = put(conn, Routes.team_path(conn, :update, team_id), data_fixture(@update_attrs))

    data = json_response(conn, 200)["data"]

    assert data["id"] == team_id
    assert data["type"] == "team"
    assert data["attributes"]["name"] == @update_attrs.name
    assert data["attributes"]["public"] == @update_attrs.public
  end

  test "does not update team and renders errors when data is invalid", %{conn: conn, user: user} do
    team = team_factory(user)
    team_id = Integer.to_string(team.id)

    conn = put(conn, Routes.team_path(conn, :update, team_id), data_fixture(@invalid_attrs))

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "show public team from user and renders team", %{conn: conn, user: user} do
    team = team_factory(user, %{public: true})

    conn =
      get(
        conn,
        Routes.team_path(conn, :index),
        %{"filter" => %{"share_id" => team.share_id}}
      )

    data = json_response(conn, 200)["data"]

    assert data["id"] == Integer.to_string(team.id)
    assert data["type"] == "team"
    assert data["attributes"]["name"] == team.name
    assert data["attributes"]["share-id"] == team.share_id
  end

  test "show public team from another user and renders team", %{conn: conn} do
    owner = Timo.Repo.insert!(%Timo.API.User{username: "some other user"})
    team = team_factory(owner, %{public: true})

    conn =
      get(
        conn,
        Routes.team_path(conn, :index),
        %{"filter" => %{"share_id" => team.share_id}}
      )

    data = json_response(conn, 200)["data"]

    assert data["id"] == Integer.to_string(team.id)
    assert data["type"] == "team"
    assert data["attributes"]["name"] == team.name
    assert data["attributes"]["share-id"] == team.share_id
  end

  test "show private team and renders error", %{conn: conn, user: user} do
    team = team_factory(user)

    conn =
      get(
        conn,
        Routes.team_path(conn, :index),
        %{"filter" => %{"share_id" => team.share_id}}
      )

    assert json_response(conn, 404)["errors"] == [%{"detail" => "Not Found"}]
  end

  test "show public team without team and renders error", %{conn: conn} do
    conn =
      get(
        conn,
        Routes.team_path(conn, :index),
        %{"filter" => %{"share_id" => "unique_id"}}
      )

    assert json_response(conn, 404)["errors"] == [%{"detail" => "Not Found"}]
  end

  test "deletes team from user and renders empty content", %{conn: conn, user: user} do
    team = team_factory(user)

    conn = delete(conn, Routes.team_path(conn, :delete, team))

    assert conn.status == 204
    assert conn.resp_body == ""
  end

  test "deletes team with members", %{conn: conn, user: user} do
    team = team_factory(user)
    member1 = member_factory(team)
    member2 = member_factory(team)

    conn = delete(conn, Routes.team_path(conn, :delete, team))

    assert conn.status == 204
    assert conn.resp_body == ""

    assert Timo.Repo.get(Timo.API.Member, member1.id) == nil
    assert Timo.Repo.get(Timo.API.Member, member2.id) == nil
  end
end
