defmodule Timo.Repo.Migrations.ModifyTeamPublicDefault do
  use Ecto.Migration

  def change do
    alter table("teams") do
      modify :public, :boolean, default: false, null: false
    end
  end
end
