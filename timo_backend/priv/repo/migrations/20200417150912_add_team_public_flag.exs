defmodule Timo.Repo.Migrations.AddTeamPublicFlag do
  use Ecto.Migration

  def change do
    alter table("teams") do
      add :public, :boolean
    end
  end
end
