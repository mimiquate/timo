defmodule Timo.API.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :name, :string

    belongs_to :team, Timo.API.Team
    belongs_to :city, Timo.API.City, on_replace: :nilify

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
