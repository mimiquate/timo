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
end
