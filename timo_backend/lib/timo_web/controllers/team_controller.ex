defmodule TimoWeb.TeamController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Team

  action_fallback TimoWeb.FallbackController

  plug TimoWeb.Plugs.SetCurrentUser when action in [:create, :show, :index]
  plug :authenticate_current_user when action in [:create, :show, :index]

  def index(conn, _params) do
    current_user = conn.assigns.current_user
    teams = API.list_user_teams(current_user)
    render(conn, "index.json-api", data: teams)
  end

  def create(conn, %{"data" => %{"type" => "teams", "attributes" => team_params}}) do
    current_user = conn.assigns.current_user

    with {:ok, %Team{} = team} <- API.create_team(current_user, team_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.team_path(conn, :show, team))
      |> render("show.json-api", data: team)
    end
  end

  def show(conn, params = %{"id" => id}) do
    current_user = conn.assigns.current_user

    with {:ok, %Team{} = team} <- API.get_user_team(current_user, id, true) do
      render(conn, "show.json-api", data: team, opts: [include: params["include"]])
    else
      _ -> {:error, :not_found}
    end
  end

  defp authenticate_current_user(conn, _params) do
    if !conn.assigns.current_user do
      {:error, :unauthorized}
    else
      conn
    end
  end
end
