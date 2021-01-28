defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API

  alias Timo.API.{
    User,
    Team,
    Member
  }

  describe "users" do
    @valid_user_attrs %{
      username: "some username",
      password: "valid_password",
      email: "email@timo"
    }
    @invalid_user_attrs %{username: nil, password: nil, email: nil}

    test "get_user/1 returns the user with given id" do
      user = user_factory()
      {:ok, %User{} = fetched_user} = API.get_user(user.id)

      assert fetched_user.username == user.username
      assert fetched_user.id == user.id
      assert fetched_user.password == nil
    end

    test "get_user/1 returns nil if the user does not exist" do
      assert API.get_user(1) == nil
    end

    test "get_user/1 returns nil if the id is nil" do
      assert API.get_user(nil) == nil
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = API.create_user(@valid_user_attrs)
      assert user.username == @valid_user_attrs.username
      assert user.verified == false
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = API.create_user(@invalid_user_attrs)
    end

    test "create_user/1 with username that already exist returns error changeset" do
      user_factory(%{email: "other_email@timo"})

      assert {:error, %Ecto.Changeset{}} = API.create_user(@valid_user_attrs)
    end

    test "get_user_by_username/1 returns user with given username" do
      user = user_factory()
      %{username: username} = user
      {:ok, fetched_user} = API.get_user_by_username(username)

      assert fetched_user.username == user.username
      assert fetched_user.id == user.id
      assert fetched_user.password == nil
    end

    test "get_user_by_username/1 returns nil if the user does not exist" do
      assert API.get_user_by_username(@valid_user_attrs.username) == nil
    end

    test "get_user_by_username/1 returns nil when user is nil" do
      assert API.get_user_by_username(nil) == nil
    end

    test "create_user/1 with email that already exist returns error changeset" do
      user_factory(%{
        username: "username",
        password: "password",
        email: "email@timo"
      })

      assert {:error, %Ecto.Changeset{}} = API.create_user(@valid_user_attrs)
    end

    test "mark_as_verified/1 changes user verified status to true" do
      user = user_factory()

      assert user.verified == false

      assert {:ok, %User{} = user} = API.mark_as_verified(user)
      assert user.verified == true
    end
  end

  describe "teams" do
    @valid_team_attrs %{name: "some name"}
    @invalid_team_attrs %{name: nil, public: nil}

    test "list_user_teams/1 returns all teams" do
      owner = user_factory()
      team = team_factory(owner)
      teams = API.list_user_teams(owner)

      assert teams == [team]
    end

    test "list_user_teams/1 returns empty list" do
      owner = user_factory()

      assert API.list_user_teams(owner) == []
    end

    test "get_user_team/2 returns the team with given id" do
      owner = user_factory()
      team = team_factory(owner)
      {:ok, fetched_team} = API.get_user_team(owner, team.id)

      assert fetched_team == team
    end

    test "get_user_team/2 returns nil when no team with given id" do
      owner = user_factory()

      assert API.get_user_team(owner, 1) == nil
    end

    test "create_team/2 with valid data creates a team" do
      owner = user_factory()

      assert {:ok, %Team{} = team} = API.create_team(owner, @valid_team_attrs)
      assert team.name == @valid_team_attrs.name
      assert team.public == false
      assert team.share_id == nil
    end

    test "create_team/2 with invalid data returns error changeset" do
      owner = user_factory()

      assert {:error, %Ecto.Changeset{}} = API.create_team(owner, @invalid_team_attrs)
    end

    test "get_team_by_id/1 with existing id" do
      owner = user_factory()
      team = team_factory(owner)
      {:ok, fetched_team} = API.get_team_by_id(team.id)

      assert fetched_team == team
    end

    test "get_team_by_id/1 without existing id returns nil" do
      assert nil == API.get_team_by_id(1)
    end

    test "update_team/2 with valid data with public true updates team" do
      owner = user_factory()
      team = team_factory(owner)

      assert {:ok, %Team{} = team} = API.update_team(team, %{public: true})
      assert team.public == true
      assert team.share_id != nil
    end

    test "update_team/2 with valid data with public false updates team" do
      owner = user_factory()
      team = team_factory(owner, %{public: true})

      assert {:ok, %Team{} = team} = API.update_team(team, %{public: false})
      assert team.public == false
      assert team.share_id == nil
    end

    test "update_team/2 with invalid data returns error changeset" do
      owner = user_factory()
      team = team_factory(owner)

      assert {:error, %Ecto.Changeset{}} = API.update_team(team, @invalid_team_attrs)
      fetched_team = Repo.get(Team, team.id)

      assert fetched_team == team
    end

    test "get_team_by_share_id/1 with public team return team" do
      owner = user_factory()
      team = team_factory(owner, %{public: true})

      assert {:ok, %Team{} = fetched_team} = API.get_team_by_share_id(team.share_id)
      assert fetched_team = team
    end

    test "get_team_by_share_id/1 with private team return nil" do
      owner = user_factory()
      team = team_factory(owner)

      assert nil == API.get_team_by_share_id(team.share_id)
    end

    test "get_team_by_share_id/1 without team return nil" do
      assert nil == API.get_team_by_share_id("unique_id")
    end

    test "get_team_by_share_id/1 with share_id nil return nil" do
      assert nil == API.get_team_by_share_id(nil)
    end

    test "delete_team/1 deletes a team" do
      owner = user_factory()
      team = team_factory(owner)

      assert {:ok, _team} = API.delete_team(team)
      assert Repo.get(Team, team.id) == nil
    end
  end

  describe "members" do
    @valid_member_attrs %{name: "some name"}
    @invalid_member_attrs %{name: nil}
    @update_member_attrs %{name: "new name"}

    test "create_member/1 with valid data creates a member" do
      team = team_factory(user_factory())
      city = city_factory()
      member_attrs = Map.merge(@valid_member_attrs, %{team_id: team.id, city_id: city.id})

      assert {:ok, %Member{} = member} = API.create_member(member_attrs)
      assert member.name == @valid_member_attrs.name
      assert member.team == team
      assert member.city == city
    end

    test "create_member/1 with invalid data returns error changeset" do
      team = team_factory(user_factory())
      city = city_factory()
      member_attrs = Map.merge(@invalid_member_attrs, %{team_id: team.id, city_id: city.id})

      assert {:error, %Ecto.Changeset{}} = API.create_member(member_attrs)
    end

    test "create_member/1 with valid data and city creates a member" do
      team = team_factory(user_factory())
      city = city_factory()
      member_attrs = Map.merge(@valid_member_attrs, %{team_id: team.id, city_id: city.id})

      assert {:ok, %Member{} = member} = API.create_member(member_attrs)
      assert member.name == @valid_member_attrs.name
      assert member.city == city
    end

    test "get_user_member/2 with valid id" do
      user = user_factory()
      team = team_factory(user)
      member = member_factory(team)

      {:ok, %Member{} = fetched_member} = API.get_user_member(user, member.id)

      assert fetched_member.id == member.id
    end

    test "get_user_member/2 with valid id and city" do
      user = user_factory()
      team = team_factory(user)
      city = city_factory()
      member = member_factory(team, city)

      {:ok, %Member{} = fetched_member} = API.get_user_member(user, member.id)

      assert fetched_member.id == member.id
    end

    test "get_user_member/2 returns nil if the member does not exist" do
      user = user_factory()

      assert API.get_user_member(user, 1) == nil
    end

    test "update_member/2 with valid data updates the member" do
      member = member_factory()

      assert {:ok, %Member{} = member} =
               API.update_member(member, @update_member_attrs, member.city)

      assert member.name == @update_member_attrs.name
    end

    test "update_member/2 with invalid data returns error changeset" do
      member = member_factory()

      assert {:error, %Ecto.Changeset{}} =
               API.update_member(member, @invalid_member_attrs, member.city)

      fetched_member = Repo.get(Member, member.id) |> Repo.preload(:city)

      assert fetched_member.id == member.id
    end

    test "update_member/2 with new city" do
      member = member_factory()
      city = city_factory(%{name: "Kyōto"})

      assert {:ok, %Member{} = member} = API.update_member(member, %{}, city)
      assert member.city == city
    end

    test "delete_member/1 deletes a member" do
      member = member_factory()

      assert {:ok, _member} = API.delete_member(member)
      assert Repo.get(Member, member.id) == nil
    end
  end

  describe "cities" do
    @default_values %{
      name: "Tokyo",
      country: "Japon",
      timezone: "Asia/Tokyo"
    }

    test "get_cities/1 get all cities given search param" do
      city_factory(@default_values)

      assert [fetched_city] = API.get_cities(%{"search" => "Tok"})
      assert fetched_city.name == "Tokyo"
    end

    test "get_cities/1 get all cities given undercase search param" do
      city_factory(@default_values)

      assert [fetched_city] = API.get_cities(%{"search" => "tok"})
      assert fetched_city.name == "Tokyo"
    end

    test "get_cities/1 get all cities given upercase search param" do
      city_factory(@default_values)

      assert [fetched_city] = API.get_cities(%{"search" => "TOK"})
      assert fetched_city.name == "Tokyo"
    end

    test "get_cities/1 get all cities given accent search param" do
      city_factory(%{name: "Kyōto"})

      assert [fetched_city] = API.get_cities(%{"search" => "Kyoto"})
      assert fetched_city.name == "Kyōto"
    end

    test "get_cities/1 get all cities given non ascii search param" do
      city_factory(%{name: "Eşfahān"})

      assert [fetched_city] = API.get_cities(%{"search" => "Esfahan"})
      assert fetched_city.name == "Eşfahān"
    end

    test "get_cities/1 get multiple cities" do
      city_1 = city_factory(%{name: "Āgra"})
      city_2 = city_factory(%{name: "Ağrı"})
      city_3 = city_factory(%{name: "Agriá"})

      cities = API.get_cities(%{"search" => "Agr"})

      assert Enum.member?(cities, city_1)
      assert Enum.member?(cities, city_2)
      assert Enum.member?(cities, city_3)
    end

    test "get_city_by_id/1 get city" do
      city = city_factory()

      fetched_city = API.get_city_by_id(city.id)

      assert fetched_city == city
    end

    test "get_city_by_id/1 get nil" do
      assert nil == API.get_city_by_id(1)
    end

    test "get_city_by_id/1 get nil with nil param" do
      assert nil == API.get_city_by_id(nil)
    end

    test "cant create member with empty city" do
      owner = user_factory()
      team = team_factory(owner)
      member_attrs = %{name: "Jose", team_id: team.id}

      {:error, %Ecto.Changeset{}} = API.create_member(member_attrs)
    end
  end
end
