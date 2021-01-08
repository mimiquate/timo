defmodule TimoWeb.MemberView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :timezone])

  has_one :city,
    serializer: TimoWeb.CityView,
    include: true
end
