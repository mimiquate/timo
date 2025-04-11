defmodule TimoWeb.MemberController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Member
  alias Timo.API.Team
  alias Timo.API.City
  alias JaSerializer.Params
  alias TimoWeb.Plugs.EnsureCurrentUser

  plug EnsureCurrentUser when action in [:create, :update, :delete]

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => data = %{"type" => "members", "attributes" => params}}) do
    member = Params.to_attributes(data)
    %Team{} = team = API.get_team(member["team_id"])
    %City{} = city = API.get_city(member["city_id"])

    with {:ok, %Member{} = member} <- API.create_member(team, params, city) do
      conn
      |> put_view(TimoWeb.MemberJSON)
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/members/#{member}")
      |> render(:show, data: member)
    end
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "members", "attributes" => params}}) do
    current_user = conn.assigns.current_user
    data = Params.to_attributes(data)
    city = data["city_id"] |> API.get_city()

    with {:ok, member} <- API.get_user_member(current_user, id),
         {:ok, %Member{} = member} <- API.update_member(member, params, city) do
      conn
      |> put_view(TimoWeb.MemberJSON)
      |> render(:show, data: member)
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = conn.assigns.current_user

    with {:ok, member} <- API.get_user_member(current_user, id),
         {:ok, %Member{}} <- API.delete_member(member) do
      send_resp(conn, :no_content, "")
    end
  end
end
