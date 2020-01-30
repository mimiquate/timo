defmodule Timo.API do
  @moduledoc """
  The API context.
  """

  import Ecto.Query, warn: false
  alias Timo.Repo
  alias Timo.API.User
  alias Timo.API.Team

  @doc """
  Gets a single user.
  returns nil if the User does not exist.
  """
  def get_user(id) do
    with %User{} = user <- Repo.get(User, id) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get_user_by_username(nil), do: nil

  def get_user_by_username(name) do
    with %User{} = user <- Repo.get_by(User, username: name) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def find_or_create_user_by_username(username) do
    with {:ok, %User{} = user} <- get_user_by_username(username) do
      {:ok, :existing, user}
    else
      nil ->
        with {:ok, %User{} = user} <- create_user(%{username: username}) do
          {:ok, :new, user}
        else
          error -> error
        end
    end
  end

  def list_teams do
    Repo.all(Team)
  end

  @doc """
  Gets a single team.
  Raises `Ecto.NoResultsError` if the Team does not exist.
  """
  def get_team!(id), do: Repo.get!(Team, id)

  def create_team(attrs \\ %{}) do
    %Team{}
    |> Team.changeset(attrs)
    |> Repo.insert()
  end

  def update_team(%Team{} = team, attrs) do
    team
    |> Team.changeset(attrs)
    |> Repo.update()
  end

  def delete_team(%Team{} = team) do
    Repo.delete(team)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking team changes.
  """
  def change_team(%Team{} = team) do
    Team.changeset(team, %{})
  end
end
