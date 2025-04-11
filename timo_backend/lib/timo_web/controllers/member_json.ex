defmodule TimoWeb.MemberJSON do
  use JaSerializer.PhoenixView
  alias Timo.API.User

  def type, do: "member"

  attributes([:name])

  has_one :city,
    serializer: TimoWeb.CityJSON,
    include: true
end
