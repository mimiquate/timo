defmodule Timo.API do
  @moduledoc """
  The API context.
  """

  import Ecto.Query, warn: false
  alias Timo.Repo

  alias Timo.API.User

  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.
  returns nil if the User does not exist.
  """
  def get_user(id), do: Repo.get(User, id)

  def get_user_by(params), do: Repo.get_by(User, params)

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.
  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  def get_user_by_username(nil), do: nil
  def get_user_by_username(name) do
    with %User{} = user <- Repo.get_by(User, username: name) do
      {:ok, user}
    else
      nil -> nil
    end
  end
end
