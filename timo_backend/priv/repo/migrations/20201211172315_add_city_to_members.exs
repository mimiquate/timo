defmodule Timo.Repo.Migrations.AddCityToMembers do
  use Ecto.Migration

  def change do
    alter table("members") do
      add :city_id, references(:cities, on_delete: :nilify_all, on_update: :update_all)
    end

    create index(:members, [:city_id])
  end
end
