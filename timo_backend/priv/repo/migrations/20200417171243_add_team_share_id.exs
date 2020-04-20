defmodule Timo.Repo.Migrations.AddTeamShareId do
  use Ecto.Migration

  def change do
    alter table("teams") do
      add :share_id, :string
    end

    create unique_index(:teams, [:share_id])
  end
end
