defmodule Timo.SlackContext do
  import Ecto.Query, warn: false

  alias Timo.Repo
  alias Timo.API.SlackAccessToken

  def get_workspace_token(workspace) do
    SlackAccessToken
    |> where([u], u.workspace == ^workspace)
    |> select([u], u.token)
    |> last(:inserted_at)
    |> Repo.one()
  end

  def create_slack_access_token(attrs) do
    %SlackAccessToken{}
    |> SlackAccessToken.changeset(attrs)
    |> Repo.insert()
  end
end
