defmodule Timo.Repo.Migrations.RemoveNameAscii do
  use Ecto.Migration

  def change do
    alter table("cities") do
      remove :name_ascii
    end
  end
end
