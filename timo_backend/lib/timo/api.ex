defmodule Timo.API do
  @moduledoc """
  The API context.
  """

  import Ecto.Query, warn: false
  alias Timo.Repo
  alias Timo.API.User

  @doc """
  Gets a single user.
  returns nil if the User does not exist.
  """
  def get_user(id) do
    with %User{} = user <- Repo.get(User, id) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get_user_by_username(nil), do: nil

  def get_user_by_username(name) do
    with %User{} = user <- Repo.get_by(User, username: name) do
      {:ok, user}
    else
      nil -> nil
    end
  end

  def find_or_create_user_by_username(username) do
    with {:ok, %User{} = user} <- get_user_by_username(username) do
      {:ok, user}
    else
      nil -> create_user(%{username: username})
    end
  end
end
