defmodule TimoWeb.TeamJSON do
  use JaSerializer.PhoenixView
  alias Timo.API.User

  def type, do: "team"

  attributes([:name, :public, :share_id])

  has_many :members,
    serializer: TimoWeb.MemberJSON,
    identifiers: :when_included
end
