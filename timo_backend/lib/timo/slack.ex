defmodule Timo.Slack do
  import Ecto.Query, warn: false

  alias Timo.Repo
  alias Timo.API.SlackAccessToken
  alias Timo.Slack.Encrypt

  def get_workspace_token(workspace) do
    SlackAccessToken
    |> where([u], u.workspace == ^workspace)
    |> select([u], u.token)
    |> last(:inserted_at)
    |> Repo.one()
    |> Encrypt.decrypt()
  end

  def create_slack_access_token(attrs) do
    encrypted_token = attrs.token |> Encrypt.encrypt()
    attrs = attrs |> Map.put(:token, encrypted_token)

    %SlackAccessToken{}
    |> SlackAccessToken.changeset(attrs)
    |> Repo.insert()
  end
end
