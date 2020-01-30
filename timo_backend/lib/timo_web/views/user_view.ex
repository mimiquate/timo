defmodule TimoWeb.UserView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  attributes([:username, :inserted_at, :updated_at])

  has_many :teams,
    serializer: TimoWeb.TeamView,
    include: false,
    identifiers: :when_included
end
