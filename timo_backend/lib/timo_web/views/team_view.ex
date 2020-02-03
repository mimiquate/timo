defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :inserted_at, :updated_at])
end
