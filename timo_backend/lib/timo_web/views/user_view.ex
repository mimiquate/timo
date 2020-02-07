defmodule TimoWeb.UserView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:username])
end
