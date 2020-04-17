defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :public])

  has_many :members,
    serializer: TimoWeb.MemberView,
    identifiers: :when_included
end
