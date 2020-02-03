defmodule TimoWeb.MemberView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :timezone, :inserted_at, :updated_at])
end
