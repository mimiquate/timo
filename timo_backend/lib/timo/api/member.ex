defmodule Timo.API.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :name, :string
    field :timezone, :string

    belongs_to :team, Timo.API.Team
    belongs_to :city, Timo.API.City

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:name, :timezone])
    |> validate_required([:name, :timezone])
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
