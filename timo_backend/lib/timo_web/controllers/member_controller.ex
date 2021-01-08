defmodule TimoWeb.MemberController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Member
  alias JaSerializer.Params
  alias TimoWeb.Plugs.{SetCurrentUser, AuthenticateCurrentUser}

  plug SetCurrentUser when action in [:create, :update, :delete]
  plug AuthenticateCurrentUser when action in [:create, :update, :delete]

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => data = %{"type" => "members", "attributes" => params}}) do
    member = Params.to_attributes(data)
    {:ok, team} = API.get_team_by_id(member["team_id"])
    city = API.get_city_by_id(member["city_id"])

    with {:ok, %Member{} = member} <- API.create_member(team, params, city) do
      conn
      |> put_status(:created)
      |> render("show.json-api", data: member)
    end
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "members", "attributes" => params}}) do
    current_user = conn.assigns.current_user
    data = Params.to_attributes(data)
    city = data["city_id"] |> API.get_city_by_id()

    with {:ok, member} <- API.get_user_member(current_user, id),
         {:ok, %Member{} = member} <- API.update_member(member, params, city) do
      render(conn, "show.json-api", data: member)
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
