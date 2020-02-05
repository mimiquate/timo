defmodule Timo.TestHelpers do
  alias Timo.Repo

  alias Timo.API.{
    User,
    Team,
    Member
  }

  def user_factory(_attrs \\ %{}) do
    user = Repo.insert!(%User{ username: "some username" })

    user
  end

  def team_factory(%User{} = user, _attrs \\ %{}) do
    team = Repo.insert!(%Team{ name: "some name", user_id: user.id })

    team
  end

  def member_factory(%Team{} = team, _attrs \\ %{}) do
    member = Repo.insert!(%Member{
      name: "some name",
      timezone: "America/Montevideo",
      team_id: team.id
    })

    member
  end
end
