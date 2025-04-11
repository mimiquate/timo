defmodule Timo.Repo.Migrations.CreateTeams do
  use Ecto.Migration

  def change do
    create table(:teams) do
      add :name, :string
      add :public, :boolean, default: false, null: false
      add :share_id, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:teams, [:user_id])
    create unique_index(:teams, [:share_id])
  end
end
