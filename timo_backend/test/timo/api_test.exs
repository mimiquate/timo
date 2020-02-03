defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API

  alias Timo.API.{
    User,
    Team,
    Member
  }

  describe "users" do
    @valid_user_attrs %{username: "some username"}
    @invalid_user_attrs %{username: nil}

    test "get_user/1 returns the user with given id" do
      user = user_fixture()
      {:ok, %User{} = fetched_user} = API.get_user(user.id)

      assert fetched_user == user
    end

    test "get_user/1 returns nil if the user does not exist" do
      assert API.get_user(1) == nil
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = API.create_user(@valid_user_attrs)
      assert user.username == "some username"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = API.create_user(@invalid_user_attrs)
    end

    test "create_user/1 with data that already exist returns error changeset" do
      user_fixture()

      assert {:error, %Ecto.Changeset{}} = API.create_user(@valid_user_attrs)
    end

    test "get_user_by_username/1 returns user with given username" do
      user = user_fixture()
      %{username: username} = user
      {:ok, fetched_user} = API.get_user_by_username(username)

      assert fetched_user == user
    end

    test "get_user_by_username/1 returns nil if the user does not exist" do
      assert API.get_user_by_username("some username") == nil
    end

    test "get_user_by_username/1 returns nil when user is nil" do
      assert API.get_user_by_username(nil) == nil
    end

    test "find_or_create_user_by_username/1 returns user with given username" do
      user = user_fixture()
      {:ok, :existing, fetched_user} = API.find_or_create_user_by_username("some username")

      assert fetched_user == user
    end

    test "find_or_create_user_by_username/1 creates and returns user with given username" do
      {:ok, :new, user} = API.find_or_create_user_by_username("some username")

      assert user.username == "some username"
    end

    test "find_or_create_user_by_username/1 creates with invalid data returns error changeset" do
      {:error, %Ecto.Changeset{}} = API.find_or_create_user_by_username(nil)
    end
  end

  describe "teams" do
    @valid_team_attrs %{name: "some name"}
    @invalid_team_attrs %{name: nil}

    test "list_user_teams/1 returns all teams" do
      owner = user_fixture()
      team = team_fixture(owner)
      teams = API.list_user_teams(owner)
      teams = Enum.map(teams, fn t -> Timo.Repo.preload(t, :user) end)

      assert teams == [team]
    end

    test "list_user_teams/1 returns empty list" do
      owner = user_fixture()

      assert API.list_user_teams(owner) == []
    end

    test "get_user_team/2 returns the team with given id" do
      owner = user_fixture()
      team = team_fixture(owner)
      {:ok, fetched_team} = API.get_user_team(owner, team.id)
      fetched_team = Timo.Repo.preload(fetched_team, :user)

      assert fetched_team == team
    end

    test "get_user_team/2 returns nil when no team with given id" do
      owner = user_fixture()

      assert API.get_user_team(owner, 1) == nil
    end

    test "create_team/2 with valid data creates a team" do
      owner = user_fixture()

      assert {:ok, %Team{} = team} = API.create_team(owner, @valid_team_attrs)
      assert team.name == "some name"
    end

    test "create_team/2 with invalid data returns error changeset" do
      owner = user_fixture()

      assert {:error, %Ecto.Changeset{}} = API.create_team(owner, @invalid_team_attrs)
    end

    test "get_team_by_id/1 with existing id" do
      owner = user_fixture()
      team = team_fixture(owner)
      {:ok, fetched_team} = API.get_team_by_id(team.id)
      fetched_team = Timo.Repo.preload(fetched_team, :user)

      assert fetched_team == team
    end

    test "get_team_by_id/1 without existing id returns nil" do
      assert nil == API.get_team_by_id(1)
    end
  end

  describe "members" do
    @valid_member_attrs %{name: "some name", timezone: "some timezone"}
    @invalid_member_attrs %{name: nil, timezone: nil}

    test "list_team_members/1 returns all members" do
      team = team_fixture(user_fixture())
      member = member_fixture(team)
      members = API.list_team_members(team)

      members =
        Enum.map(members, fn m ->
          Timo.Repo.preload(m, [:team, team: :user])
        end)

      assert members == [member]
    end

    test "list_team_members/1 returns empty list" do
      team = team_fixture(user_fixture())

      assert API.list_team_members(team) == []
    end

    test "get_team_member/2 returns the member with given id" do
      team = team_fixture(user_fixture())
      member = member_fixture(team)
      {:ok, fetched_member} = API.get_team_member(team, member.id)
      fetched_member = Timo.Repo.preload(fetched_member, [:team, team: :user])

      assert fetched_member == member
    end

    test "get_team_member/2 returns nil when no member with given id" do
      team = team_fixture(user_fixture())

      assert API.get_team_member(team, 1) == nil
    end

    test "create_member/1 with valid data creates a member" do
      team = team_fixture(user_fixture())

      assert {:ok, %Member{} = member} = API.create_member(team, @valid_member_attrs)
      assert member.name == "some name"
      assert member.timezone == "some timezone"
    end

    test "create_member/1 with invalid data returns error changeset" do
      team = team_fixture(user_fixture())

      assert {:error, %Ecto.Changeset{}} = API.create_member(team, @invalid_member_attrs)
    end
  end
end
