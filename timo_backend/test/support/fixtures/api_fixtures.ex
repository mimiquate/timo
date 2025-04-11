defmodule Timo.APIFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Timo.API` context.
  """

  @doc """
  Generate a city.
  """
  def city_fixture(attrs \\ %{}) do
    {:ok, city} =
      attrs
      |> Enum.into(%{
        country: "some country",
        name: "some name",
        timezone: "some timezone"
      })
      |> Timo.API.create_city()

    city
  end

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        password: "some password",
        password_hash: "some password_hash",
        username: "some username",
        verified: true
      })
      |> Timo.API.create_user()

    user
  end
end
