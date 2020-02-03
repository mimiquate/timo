defmodule TimoWeb.MemberController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Member
  alias Timo.API.Team
  alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def index(conn, %{"data" => data}) do
    member = Params.to_attributes(data)
    members = API.list_team_members(%Team{id: member["team_id"]})
    render(conn, "index.json-api", data: members)
  end

  def create(conn, %{"data" => data = %{"type" => "member", "attributes" => member_params}}) do
    member = Params.to_attributes(data)
    {:ok, team} = API.get_team_by_id(member["team_id"])

    with {:ok, %Member{} = member} <- API.create_member(team, member_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.member_path(conn, :show, member))
      |> render("show.json-api", data: member)
    end
  end
end
