defmodule Timo.API.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :username, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :email, :string
    field :verified, :boolean, default: false

    timestamps(type: :utc_datetime)
  end

  @doc false
  def registration_changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :password, :email, :verified])
    |> validate_required([:username, :password, :email, :verified])
    |> validate_length(:username, min: 4)
    |> validate_length(:password, min: 8)
    |> unique_constraint(:username)
    |> unique_constraint(:email)
    |> put_pass_hash()
  end

  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:verified])
    |> validate_required([:verified])
  end

  defp put_pass_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Pbkdf2.hash_pwd_salt(pass))

      _ ->
        changeset
    end
  end
end
