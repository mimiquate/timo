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

  def list_user_teams(%User{} = user) do
    Team
    |> user_team_query(user)
    |> Repo.all()
  end

  @doc """
  Gets a single team.
  returns nil if the Team does not exist.
  """
  def get_user_team(%User{} = user, id) do
    query = user_team_query(Team, user)

    with %Team{} = team <- Repo.get(query, id) do
      {:ok, team}
    else
      nil -> nil
    end
  end

  def create_team(%User{} = user, attrs \\ %{}) do
    %Team{}
    |> Team.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  defp user_team_query(query, %User{id: user_id}) do
    from(t in query, where: t.user_id == ^user_id, preload: :user)
  end
end
