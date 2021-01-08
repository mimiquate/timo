defmodule Timo.API.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :name, :string
    field :timezone, :string

    belongs_to :team, Timo.API.Team
    belongs_to :city, Timo.API.City, on_replace: :nilify

    timestamps()
  end

  @doc false
  def changeset(member, attrs, city) do
    member
    |> cast(attrs, [:name, :timezone])
    |> validate_required([:name, :timezone])
    |> validate_timezone(:timezone)
    |> validate_city(city)
  end

  defp validate_city(changeset, nil), do: changeset

  defp validate_city(changeset, city) do
    timezone = fetch_field!(changeset, :timezone)

    case timezone == city.timezone do
      true -> changeset
      false -> add_error(changeset, :timezone, "City does not match timezone")
    end
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
