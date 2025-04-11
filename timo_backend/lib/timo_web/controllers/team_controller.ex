defmodule TimoWeb.TeamController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Team
  alias TimoWeb.Plugs.EnsureCurrentUser

  action_fallback TimoWeb.FallbackController

  plug EnsureCurrentUser when action in [:create, :update, :delete]

  def index(conn, params = %{"filter" => %{"share_id" => share_id}}) do
    with {:ok, %Team{} = team} <- API.get_team_by_share_id(share_id) do
      conn
      |> put_view(TimoWeb.TeamJSON)
      |> render(:index, data: team, opts: [include: params["include"]])
    else
      _ -> {:error, :not_found}
    end
  end

  def index(conn, _params) do
    current_user = conn.assigns.current_user

    if !current_user do
      {:error, :unauthorized}
    else
      teams = API.list_user_teams(current_user)

      conn
      |> put_view(TimoWeb.TeamJSON)
      |> render(:index, data: teams)
    end
  end

  def create(conn, %{"data" => %{"type" => "teams", "attributes" => team_params}}) do
    current_user = conn.assigns.current_user

    with {:ok, %Team{} = team} <- API.create_team(current_user, team_params) do
      conn
      |> put_view(TimoWeb.TeamJSON)
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/teams/#{team}")
      |> render(:show, data: team)
    end
  end

  def show(conn, params = %{"id" => id}) do
    current_user = conn.assigns.current_user

    with {:ok, %Team{} = team} <- API.get_user_team(current_user, id, true) do
      conn
      |> put_view(TimoWeb.TeamJSON)
      |> render(:show, data: team, opts: [include: params["include"]])
    else
      _ -> {:error, :not_found}
    end
  end

  def update(conn, %{"id" => id, "data" => %{"type" => "teams", "attributes" => team_params}}) do
    current_user = conn.assigns.current_user

    with {:ok, team} <- API.get_user_team(current_user, id),
         {:ok, %Team{} = team} <- API.update_team(team, team_params) do
      conn
      |> put_view(TimoWeb.TeamJSON)
      |> render(:show, data: team)
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = conn.assigns.current_user

    with {:ok, team} <- API.get_user_team(current_user, id),
         {:ok, %Team{}} <- API.delete_team(team) do
      send_resp(conn, :no_content, "")
    end
  end
end
