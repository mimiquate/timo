defmodule Timo.API.City do
  use Ecto.Schema
  import Ecto.Changeset

  schema "cities" do
    field :name, :string
    field :country, :string
    field :timezone, :string
    field :name_ascii, :string

    timestamps()
  end

  @doc false
  def changeset(city, attrs) do
    city
    |> cast(attrs, [:name, :country, :timezone, :name_ascii])
    |> validate_required([:name, :country, :timezone, :name_ascii])
    |> validate_timezone(:timezone)
  end

  defp validate_timezone(changeset, :timezone) do
    validate_change(changeset, :timezone, fn :timezone, timezone ->
      case Tzdata.zone_exists?(timezone) do
        true -> []
        false -> [{:timezone, "Invalid timezone"}]
      end
    end)
  end
end
