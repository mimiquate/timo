defmodule Timo.Repo.Migrations.RemoveMemberTimezone do
  use Ecto.Migration

  def change do
    alter table("members") do
      remove :timezone, :string
    end
  end
end
