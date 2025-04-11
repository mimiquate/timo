defmodule TimoWeb.UserJSON do
  use JaSerializer.PhoenixView
  alias Timo.API.User

  def type, do: "user"

  attributes([:username])
end
