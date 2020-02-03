defmodule Timo.Repo.Migrations.CreateMembers do
  use Ecto.Migration

  def change do
    create table(:members) do
      add :name, :string, null: false
      add :timezone, :string, null: false
      add :team_id, references(:teams, on_delete: :nothing)

      timestamps()
    end

    create index(:members, [:team_id])
  end
end
