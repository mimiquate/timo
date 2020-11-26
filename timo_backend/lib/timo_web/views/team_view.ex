defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:name, :public, :share_id])

  has_many :members,
    serializer: TimoWeb.MemberView,
    identifiers: :when_included
end
