defmodule TimoWeb.CityView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :country, :timezone])
end
