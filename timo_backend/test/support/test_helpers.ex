defmodule Timo.TestHelpers do
  alias Timo.Repo

  alias Timo.API.{
    User,
    Team,
    Member
  }

  def user_factory(attrs \\ %{}) do
    default_value = %{username: "some username"}
    attrs = Enum.into(attrs, default_value)

    User
    |> struct!(attrs)
    |> Repo.insert!()
  end

  def team_factory(%User{} = user, attrs \\ %{}) do
    default_value = %{name: "some name", user_id: user.id}
    attrs = Enum.into(attrs, default_value)

    Team
    |> struct!(attrs)
    |> Repo.insert!()
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
  end
end