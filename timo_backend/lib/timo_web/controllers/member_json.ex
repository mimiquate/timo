defmodule TimoWeb.MemberJSON do
  use JaSerializer.PhoenixView

  def type, do: "member"

  attributes([:name])

  has_one :city,
    serializer: TimoWeb.CityJSON,
    include: true
end
