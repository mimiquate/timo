defmodule Timo.Repo.Migrations.AddCities do
  use Ecto.Migration

  def change do
    create table("cities") do
      add :name, :string, null: false
      add :country, :string, null: false
      add :timezone, :string, null: false
      add :name_ascii, :string, null: false

      timestamps()
    end
  end
end
