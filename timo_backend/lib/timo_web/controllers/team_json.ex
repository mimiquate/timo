defmodule TimoWeb.TeamJSON do
  use JaSerializer.PhoenixView

  def type, do: "team"

  attributes([:name, :public, :share_id])

  has_many :members,
    serializer: TimoWeb.MemberJSON,
    identifiers: :when_included
end
