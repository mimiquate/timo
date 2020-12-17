defmodule TimoWeb.MemberControllerTest do
  use TimoWeb.ConnCase
  import Plug.Test

  alias Timo.API
  alias Timo.API.Member

  @create_attrs %{name: "some name", timezone: "America/Montevideo"}
  @invalid_attrs %{name: nil, timezone: nil}
  @update_attrs %{name: "some new name", timezone: "America/Buenos_Aires"}

  def data_fixture(attribute, team_id) do
    %{
      "meta" => %{},
      "data" => %{
        "type" => "members",
        "attributes" => attribute,
        "relationships" => relationships(team_id)
      }
    }
  end

  defp relationships(team_id, city_id \\ nil) do
    %{
      "team" => %{
        "data" => %{
          "type" => "teams",
          "id" => team_id
        }
      },
      "city" => %{
        "data" => %{
          "type" => "cities",
          "id" => city_id
        }
      }
    }
  end

  setup %{conn: conn} do
    user = user_factory()
    team = team_factory(user)

    conn =
      conn
      |> init_test_session(user_id: user.id)
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn, team: team, user: user}
  end

  test "creates member and renders member when data is valid", %{
    conn: conn,
    team: team,
    user: user
  } do
    conn = post(conn, Routes.member_path(conn, :create), data_fixture(@create_attrs, team.id))

    assert data = json_response(conn, 201)["data"]
    assert data["type"] == "member"
    assert data["attributes"]["name"] == @create_attrs.name
    assert data["attributes"]["timezone"] == @create_attrs.timezone

    {:ok, %Member{} = member} = API.get_user_member(user, data["id"])

    assert Integer.to_string(member.id) == data["id"]
    assert member.team_id == team.id
    assert member.name == data["attributes"]["name"]
  end

  test "does not create member and renders errors when data is invalid", %{conn: conn, team: team} do
    conn = post(conn, Routes.member_path(conn, :create), data_fixture(@invalid_attrs, team.id))

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates member and renders member when data is valid", %{conn: conn, team: team} do
    member = member_factory(team)
    member_id = Integer.to_string(member.id)

    conn =
      put(
        conn,
        Routes.member_path(conn, :update, member_id),
        data_fixture(@update_attrs, team.id)
      )

    data = json_response(conn, 200)["data"]

    assert data["id"] == member_id
    assert data["type"] == "member"
    assert data["attributes"]["name"] == @update_attrs.name
    assert data["attributes"]["timezone"] == @update_attrs.timezone
  end

  test "does not update member and renders errors when data is invalid", %{conn: conn, team: team} do
    member = member_factory(team)
    member_id = Integer.to_string(member.id)

    conn =
      put(
        conn,
        Routes.member_path(conn, :update, member_id),
        data_fixture(@invalid_attrs, team.id)
      )

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes member", %{conn: conn, team: team} do
    member = member_factory(team)
    conn = delete(conn, Routes.member_path(conn, :delete, member))

    assert conn.status == 204
    assert conn.resp_body == ""

    assert Timo.Repo.get(Member, member.id) == nil
  end
end
