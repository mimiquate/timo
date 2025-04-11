defmodule TimoWeb.CityJSON do
  use JaSerializer.PhoenixView

  def type, do: "city"

  attributes([:name, :country, :timezone])
end
