defmodule TimoWeb.TeamController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Team

  action_fallback TimoWeb.FallbackController

  def index(conn, _params, current_user) do
    teams = API.list_user_teams(current_user)
    render(conn, "index.json-api", data: teams)
  end

  def create(conn, %{"data" => %{"type" => "team", "attributes" => team_params}},
    current_user) do
      with {:ok, %Team{} = team} <- API.create_team(current_user, team_params) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.team_path(conn, :show, team))
        |> render("show.json-api", data: team)
      end
  end

  def show(conn, %{"id" => id}, current_user) do
    with {:ok, %Team{} = team} <- API.get_user_team(current_user, id) do
      render(conn, "show.json-api", data: team)
    else
      _ -> {:error, :not_found}
    end
  end

  def action(conn, _) do
    args = [conn, conn.params, conn.assigns.current_user]
    apply(__MODULE__, action_name(conn), args)
  end
end
