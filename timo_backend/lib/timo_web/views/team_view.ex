defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name])

  has_many :members,
    serializer: TimoWeb.MemberView,
    include: false,
    identifiers: :when_included
end
