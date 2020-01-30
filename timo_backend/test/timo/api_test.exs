defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API

  describe "users" do
    alias Timo.API.User

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
      {:ok, %User{} = getUser} = API.get_user(user.id)

      assert getUser == user
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
      {:ok, get_user} = API.get_user_by_username(username)

      assert get_user == user
    end

    test "get_user_by_username/1 returns nil if the user does not exist" do
      assert API.get_user_by_username("some username") == nil
    end

    test "get_user_by_username/1 returns nil when user is nil" do
      assert API.get_user_by_username(nil) == nil
    end

    test "find_or_create_user_by_username/1 returns user with given username" do
      user = user_fixture()
      {:ok, :existing, get_user} = API.find_or_create_user_by_username("some username")

      assert get_user == user
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
    @update_attrs %{name: "some updated name"}
    @invalid_attrs %{name: nil}

    def team_fixture(attrs \\ %{}) do
      {:ok, team} =
        attrs
        |> Enum.into(@valid_attrs)
        |> API.create_team()

      team
    end

    test "list_teams/0 returns all teams" do
      team = team_fixture()
      assert API.list_teams() == [team]
    end

    test "get_team!/1 returns the team with given id" do
      team = team_fixture()
      assert API.get_team!(team.id) == team
    end

    test "create_team/1 with valid data creates a team" do
      assert {:ok, %Team{} = team} = API.create_team(@valid_attrs)
      assert team.name == "some name"
    end

    test "create_team/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = API.create_team(@invalid_attrs)
    end

    test "update_team/2 with valid data updates the team" do
      team = team_fixture()
      assert {:ok, %Team{} = team} = API.update_team(team, @update_attrs)
      assert team.name == "some updated name"
    end

    test "update_team/2 with invalid data returns error changeset" do
      team = team_fixture()
      assert {:error, %Ecto.Changeset{}} = API.update_team(team, @invalid_attrs)
      assert team == API.get_team!(team.id)
    end

    test "delete_team/1 deletes the team" do
      team = team_fixture()
      assert {:ok, %Team{}} = API.delete_team(team)
      assert_raise Ecto.NoResultsError, fn -> API.get_team!(team.id) end
    end

    test "change_team/1 returns a team changeset" do
      team = team_fixture()
      assert %Ecto.Changeset{} = API.change_team(team)
    end
  end
end
