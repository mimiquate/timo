defmodule Timo.API.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :name, :string
    field :timezone, :string

    belongs_to :team, Timo.API.Team

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:name, :timezone])
    |> validate_required([:name, :timezone])
  end
end
