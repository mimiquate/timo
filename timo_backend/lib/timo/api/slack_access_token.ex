defmodule Timo.API.SlackAccessToken do
  use Ecto.Schema
  import Ecto.Changeset

  schema "slack_access_token" do
    field :token, :string
    field :workspace, :string

    timestamps()
  end

  def changeset(slack_access_token, attrs) do
    slack_access_token
    |> cast(attrs, [:token, :workspace])
  end
end
