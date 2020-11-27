defmodule Timo.Repo.Migrations.AddSlackAccessToken do
  use Ecto.Migration

  def change do
    create table(:slack_access_token) do
      add :token, :string, null: false
      add :workspace, :string, null: false

      timestamps()
    end
  end
end
