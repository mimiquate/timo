defmodule Timo.Repo.Migrations.ModifyMembersOnTeamDelete do
  use Ecto.Migration

  def change do
    alter table("members") do
      modify :team_id, references(:teams, on_delete: :delete_all),
        from: references(:teams, on_delete: :nothing)
    end
  end
end
