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

  def member_factory(%Team{} = team) do
    city = city_factory()
    member_factory(team, city)
  end

  def member_factory(%Team{} = team, %City{} = city) do
    member_factory(team, %{}, city)
  end

  def member_factory(%Team{} = team, attrs \\ %{}, %City{} = city) do
    default_value = %{name: "some name"}

    attrs = Enum.into(attrs, default_value)

    %Member{}
    |> Member.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:team, team)
    |> Ecto.Changeset.put_assoc(:city, city)
    |> Repo.insert!()
  end

  def city_factory(attrs \\ %{}) do
    default_value = %{
      name: "Montevideo",
      country: "Uruguay",
      timezone: "America/Montevideo"
    }

    attrs = Enum.into(attrs, default_value)

    City
    |> struct!(attrs)
    |> Repo.insert!()
  end
end
