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
    |> put_share_id()
  end

  defp put_share_id(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{public: true}} ->
        put_change(changeset, :share_id, random_string(12))
        |> unique_constraint(:share_id)

      %Ecto.Changeset{valid?: true, changes: %{public: false}} ->
        put_change(changeset, :share_id, nil)

      _ ->
        changeset
    end
  end

  defp random_string(length) do
    :crypto.strong_rand_bytes(length)
    |> Base.url_encode64()
    |> binary_part(0, length)
  end
end
