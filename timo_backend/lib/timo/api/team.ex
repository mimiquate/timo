defmodule Timo.API.Team do
  use Ecto.Schema
  import Ecto.Changeset

  schema "teams" do
    field :name, :string
    field :public, :boolean

    belongs_to :user, Timo.API.User
    has_many :members, Timo.API.Member

    timestamps()
  end

  @doc false
  def changeset(team, attrs) do
    team
    |> cast(attrs, [:name, :public])
    |> validate_required([:name, :public])
  end
end
