defmodule TimoWeb.TeamController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Team
  alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def index(conn, _params) do
    teams = API.list_teams()
    render(conn, "index.json-api", data: teams)
  end

  def create(conn, %{"data" => data = %{"type" => "team", "attributes" => team_params}}) do
    with {:ok, %Team{} = team} <- API.create_team(team_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.team_path(conn, :show, team))
      |> render("show.json-api", data: team)
    end
  end

  def show(conn, %{"id" => id}) do
    team = API.get_team!(id)
    render(conn, "show.json-api", data: team)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "team", "attributes" => team_params}}) do
    team = API.get_team!(id)

    with {:ok, %Team{} = team} <- API.update_team(team, team_params) do
      render(conn, "show.json-api", data: team)
    end
  end

  def delete(conn, %{"id" => id}) do
    team = API.get_team!(id)
    with {:ok, %Team{}} <- API.delete_team(team) do
      send_resp(conn, :no_content, "")
    end
  end
end
