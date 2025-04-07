defmodule Timo.API.City do
  use Ecto.Schema
  import Ecto.Changeset

  schema "cities" do
    field :name, :string
    field :country, :string
    field :timezone, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(city, attrs) do
    city
    |> cast(attrs, [:name, :country, :timezone])
    |> validate_required([:name, :country, :timezone])
  end
end
