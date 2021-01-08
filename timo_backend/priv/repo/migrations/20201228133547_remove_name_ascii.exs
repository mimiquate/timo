defmodule Timo.Repo.Migrations.RemoveNameAscii do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS unaccent", ""

    alter table("cities") do
      remove :name_ascii, :string
    end
  end
end
