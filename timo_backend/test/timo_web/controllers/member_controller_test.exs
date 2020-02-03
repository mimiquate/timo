defmodule TimoWeb.MemberControllerTest do
  use TimoWeb.ConnCase

  alias Timo.API
  alias Timo.API.Member

  @create_attrs %{name: "some name", timezone: "some timezone"}
  @invalid_attrs %{name: nil, timezone: nil}

  def data_fixture(attribute, team_id) do
    %{
      "meta" => %{},
      "data" => %{
        "type" => "member",
        "attributes" => attribute,
        "relationships" => relationships(team_id)
      }
    }
  end

  defp relationships(team_id) do
    %{
      "team" => %{
        "data" => %{
          "type" => "team",
          "id" => team_id
        }
      }
    }
  end

  setup %{conn: conn} do
    team = team_fixture(user_fixture())

    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn, team: team}
  end

  test "lists all entries on index", %{conn: conn, team: team} do
    member1 = member_fixture(team)
    member2 = member_fixture(team)
    conn = get(conn, Routes.member_path(conn, :index), data_fixture(@create_attrs, team.id))

    [data1, data2 | []] = json_response(conn, 200)["data"]

    assert data1["type"] == "member"
    assert data2["type"] == "member"
    assert Integer.to_string(member1.id) == data1["id"]
    assert Integer.to_string(member2.id) == data2["id"]

    members_in_db = API.list_team_members(team)

    members_in_db =
      Enum.map(members_in_db, fn t ->
        Timo.Repo.preload(t, [:team, team: :user])
      end)

    assert members_in_db == [member1, member2]
  end

  test "lists empty entries on index", %{conn: conn, team: team} do
    conn = get(conn, Routes.member_path(conn, :index), data_fixture(@create_attrs, team.id))

    assert json_response(conn, 200)["data"] == []
  end

  test "creates member and renders member when data is valid", %{conn: conn, team: team} do
    conn = post(conn, Routes.member_path(conn, :create), data_fixture(@create_attrs, team.id))

    assert data = json_response(conn, 201)["data"]
    assert data["type"] == "member"
    assert data["attributes"]["name"] == @create_attrs.name
    assert data["attributes"]["timezone"] == @create_attrs.timezone

    {:ok, %Member{} = member} = API.get_team_member(team, data["id"])

    assert Integer.to_string(member.id) == data["id"]
    assert member.team_id == team.id
    assert member.name == data["attributes"]["name"]
  end

  test "does not create member and renders errors when data is invalid", %{conn: conn, team: team} do
    conn = post(conn, Routes.member_path(conn, :create), data_fixture(@invalid_attrs, team.id))

    assert json_response(conn, 422)["errors"] != %{}
  end
end
