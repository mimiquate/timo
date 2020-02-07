defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name])
end
