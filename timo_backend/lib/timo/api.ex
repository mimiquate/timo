defmodule Timo.API do
  @moduledoc """
  The API context.
  """

  import Ecto.Query, warn: false
  alias Timo.Repo
  alias Timo.API.User
  alias Timo.API.Team
  alias Timo.API.Member

  @doc """
  Gets a single user.
  returns nil if the User does not exist.
  """
  def get_user(nil), do: nil

  def get_user(id) do
    with %User{} = user <- Repo.get(User, id) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def get_user_by_username(nil), do: nil

  def get_user_by_username(name) do
    with %User{} = user <- Repo.get_by(User, username: name) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  def list_user_teams(%User{} = user) do
    Team
    |> user_team_query(user, false)
    |> Repo.all()
  end

  @doc """
  Gets a single team.
  returns nil if the Team does not exist.
  """
  def get_user_team(%User{} = user, id, preload_members \\ false) do
    query = user_team_query(Team, user, preload_members)

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

  defp user_team_query(query, %User{id: user_id}, false) do
    from(t in query, where: t.user_id == ^user_id)
  end

  defp user_team_query(query, %User{id: user_id}, true) do
    from(t in query, where: t.user_id == ^user_id, preload: :members)
  end

  def list_team_members(%Team{} = team) do
    Member
    |> team_member_query(team)
    |> Repo.all()
  end

  def create_member(%Team{} = team, attrs \\ %{}) do
    %Member{}
    |> Member.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:team, team)
    |> Repo.insert()
  end

  def get_team_by_id(id) do
    query = from(t in Team, where: t.id == ^id)

    with %Team{} = team <- Repo.get(query, id) do
      {:ok, team}
    else
      nil -> nil
    end
  end

  defp team_member_query(query, %Team{id: team_id}) do
    from(m in query, where: m.team_id == ^team_id)
  end

  def get_member(id) do
    with %Member{} = member <- Repo.get(Member, id) do
      {:ok, member}
    else
      nil -> nil
    end
  end

  def update_member(%Member{} = member, attrs) do
    member
    |> Member.changeset(attrs)
    |> Repo.update()
  end

  def update_team(%Team{} = team, attrs) do
    team
    |> Team.changeset(attrs)
    |> Repo.update()
  end

  def get_team_by_share_id(nil), do: nil

  def get_team_by_share_id(share_id) do
    query =
      from(
        t in Team,
        where: t.share_id == ^share_id and t.public == true,
        preload: :members
      )

    with %Team{} = team <- Repo.one(query) do
      {:ok, team}
    else
      nil -> nil
    end
  end

  def mark_as_verified(%User{} = user) do
    user
    |> User.update_changeset(%{verified: true})
    |> Repo.update()
  end

  def delete_team(%Team{} = team) do
    Repo.delete(team)
  end

  def delete_member(%Member{} = member) do
    Repo.delete(member)
  end
end
