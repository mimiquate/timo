defmodule TimoWeb.MemberController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Member
  alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => data = %{"type" => "members", "attributes" => member_params}}) do
    member = Params.to_attributes(data)
    {:ok, team} = API.get_team_by_id(member["team_id"])

    with {:ok, %Member{} = member} <- API.create_member(team, member_params) do
      conn
      |> put_status(:created)
      # |> put_resp_header("location", Routes.member_path(conn, :show, member))
      |> render("show.json-api", data: member)
    end
  end
end
