defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API
  alias Timo.API.User

  describe "users" do
    @valid_attrs %{username: "some username"}
    @invalid_attrs %{username: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> API.create_user()

      user
    end

    test "get_user/1 returns the user with given id" do
      user = user_fixture()
      {:ok, %User{} = fetched_user} = API.get_user(user.id)

      assert fetched_user == user
    end

    test "get_user/1 returns nil if the user does not exist" do
      assert API.get_user(1) == nil
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = API.create_user(@valid_attrs)
      assert user.username == "some username"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = API.create_user(@invalid_attrs)
    end

    test "create_user/1 with data that already exist returns error changeset" do
      user_fixture()

      assert {:error, %Ecto.Changeset{}} = API.create_user(@valid_attrs)
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
    alias Timo.API.Team

    @valid_attrs %{name: "some name"}
    @invalid_attrs %{name: nil}

    def owner_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(%{username: "some username"})
        |> API.create_user()

      user
    end

    def team_fixture(%User{} = user, attrs \\ %{}) do
      attrs = Enum.into(attrs, @valid_attrs)
      {:ok, team} = API.create_team(user, attrs)

      team
    end

    test "list_user_teams/1 returns all teams" do
      owner = owner_fixture()
      team = team_fixture(owner)
      teams = API.list_user_teams(owner)
      teams = Enum.map(teams, fn t -> Timo.Repo.preload(t, :user) end)

      assert teams == [team]
    end

    test "list_user_teams/1 returns empty list" do
      owner = owner_fixture()

      assert API.list_user_teams(owner) == []
    end

    test "get_user_team/2 returns the team with given id" do
      owner = owner_fixture()
      team = team_fixture(owner)
      {:ok, fetched_team} = API.get_user_team(owner, team.id)
      fetched_team = Timo.Repo.preload(fetched_team, :user)

      assert fetched_team == team
    end

    test "get_user_team/2 returns nil when no team with given id" do
      owner = owner_fixture()

      assert API.get_user_team(owner, 1) == nil
    end

    test "create_team/2 with valid data creates a team" do
      owner = owner_fixture()

      assert {:ok, %Team{} = team} = API.create_team(owner, @valid_attrs)
      assert team.name == "some name"
    end

    test "create_team/2 with invalid data returns error changeset" do
      owner = owner_fixture()

      assert {:error, %Ecto.Changeset{}} = API.create_team(owner, @invalid_attrs)
    end
  end
end
