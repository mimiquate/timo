defmodule Timo.API.Team do
  use Ecto.Schema
  import Ecto.Changeset

  schema "teams" do
    field :name, :string
    field :public, :boolean, default: false
    field :share_id, :string

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

  def share_changeset(team) do
    team
    |> cast(gen_unique_share_id(), [:share_id])
    |> unique_constraint(:share_id)
  end

  defp gen_unique_share_id() do
    share_id = random_string(12)
    %{"share_id" => share_id}
  end

  defp random_string(length) do
    :crypto.strong_rand_bytes(length)
    |> Base.url_encode64()
    |> binary_part(0, length)
  end
end
