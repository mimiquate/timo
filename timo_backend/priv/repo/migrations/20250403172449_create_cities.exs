defmodule Timo.Repo.Migrations.CreateCities do
  use Ecto.Migration

  def change do
    create table(:cities) do
      add :name, :string, collate: :nocase
      add :country, :string
      add :timezone, :string

      timestamps(type: :utc_datetime)
    end
  end
end
