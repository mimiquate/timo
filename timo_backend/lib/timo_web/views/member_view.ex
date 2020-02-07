defmodule TimoWeb.MemberView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :timezone])
end
