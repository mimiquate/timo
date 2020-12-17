defmodule Timo.TestHelpers do
  alias Timo.Repo

  alias Timo.API.{
    User,
    Team,
    Member,
    City
  }

  def user_factory(attrs \\ %{}) do
    default_value = %{username: "some username", password: "password", email: "email@timo"}
    attrs = Enum.into(attrs, default_value)

    User
    |> struct!(attrs)
    |> Repo.insert!()
  end

  def team_factory(%User{} = user, attrs \\ %{}) do
    default_value = %{name: "some name", user_id: user.id, share_id: "unique_id"}
    attrs = Enum.into(attrs, default_value)

    Team
    |> struct!(attrs)
    |> Repo.insert!()
  end

  def member_factory() do
    team = team_factory(user_factory())
    member_factory(team)
  end

  def member_factory(%Team{} = team, attrs \\ %{}) do
    default_value = %{
      name: "some name",
      timezone: "America/Montevideo",
      team_id: team.id
    }

    attrs = Enum.into(attrs, default_value)

    Member
    |> struct!(attrs)
    |> Repo.insert!()
    |> Repo.preload(:city)
  end

  def city_factory(attrs \\ %{}) do
    default_value = %{
      name: "Tokyo",
      country: "Japon",
      timezone: "Asia/Tokyo",
      name_ascii: "Tokyo"
    }

    attrs = Enum.into(attrs, default_value)

    City
    |> struct!(attrs)
    |> Repo.insert!()
  end
end
