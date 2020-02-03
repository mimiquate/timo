defmodule Timo.TestHelpers do
  alias Timo.API

  alias Timo.API.{
    User,
    Team
  }

  @valid_user_attrs %{username: "some username"}

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(@valid_user_attrs)
      |> API.create_user()

    user
  end

  @valid_team_attrs %{name: "some name"}

  def team_fixture(%User{} = user, attrs \\ %{}) do
    attrs = Enum.into(attrs, @valid_team_attrs)
    {:ok, team} = API.create_team(user, attrs)

    team
  end

  @valid_member_attrs %{name: "some name", timezone: "some timezone"}

  def member_fixture(%Team{} = team, attrs \\ %{}) do
    attrs = Enum.into(attrs, @valid_member_attrs)
    {:ok, member} = API.create_member(team, attrs)

    member
  end
end
