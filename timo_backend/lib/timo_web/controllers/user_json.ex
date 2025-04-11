defmodule TimoWeb.UserJSON do
  use JaSerializer.PhoenixView

  def type, do: "user"

  attributes([:username])
end
