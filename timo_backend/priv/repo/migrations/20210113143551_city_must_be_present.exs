defmodule Timo.Repo.Migrations.CityMustBePresent do
  use Ecto.Migration

  def up do
    drop constraint("members", "members_city_id_fkey")

    alter table("members") do
      modify :city_id, references(:cities, on_delete: :nilify_all, on_update: :update_all),
        null: false
    end
  end

  def down do
    drop constraint("members", "members_city_id_fkey")

    alter table("members") do
      modify :city_id, references(:cities, on_delete: :nilify_all, on_update: :update_all)
    end
  end
end
