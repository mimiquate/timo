defmodule TimoWeb.TeamView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView

  alias Timo.Repo

  attributes([:name])

  has_many :members,
    serializer: TimoWeb.MemberView,
    include: true,
    identifiers: :when_included

  def members(team, _conn) do
    case team.members do
      %Ecto.Association.NotLoaded{} ->
        team
        |> Ecto.assoc(:members)
        |> Repo.all()

      other ->
        other
    end
  end
end
