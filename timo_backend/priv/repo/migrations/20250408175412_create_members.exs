defmodule Timo.Repo.Migrations.CreateMembers do
  use Ecto.Migration

  def change do
    create table(:members) do
      add :name, :string, null: false
      add :team_id, references(:teams, on_delete: :delete_all)
      add :city_id, references(:cities, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:members, [:team_id])
    create index(:members, [:city_id])
  end
end
