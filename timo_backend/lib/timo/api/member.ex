defmodule Timo.API.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :name, :string

    belongs_to :team, Timo.API.Team
    belongs_to :city, Timo.API.City, on_replace: :nilify

    timestamps(type: :utc_datetime)
  end

  def changeset(member, attrs, nil, city) do
    member
    |> cast(attrs, [:name])
    |> put_assoc(:city, city)
    |> validate_required([:name, :city])
  end

  def changeset(member, attrs, team, city) do
    member
    |> cast(attrs, [:name])
    |> put_assoc(:team, team)
    |> put_assoc(:city, city)
    |> validate_required([:name, :team, :city])
  end
end
