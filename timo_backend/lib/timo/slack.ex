defmodule Timo.Slack do
  import Ecto.Query, warn: false

  alias Timo.Repo
  alias Timo.API.SlackAccessToken
  alias Timo.Slack.Encrypt

  defp get_workspace_token(workspace) do
    SlackAccessToken
    |> where([u], u.workspace == ^workspace)
    |> select([u], u.token)
    |> last(:inserted_at)
    |> Repo.one()
    |> Encrypt.decrypt()
  end

  defp create_timezone_list(%{"members" => members}, token) do
    members
    |> Enum.map(fn m ->
      member = Slack.Web.Users.info(m, %{token: token}) |> get_in(["user"])

      if !member["is_bot"] do
        %{
          username: member["real_name"],
          timezone: member["tz"]
        }
      end
    end)
    |> Enum.filter(&(!is_nil(&1)))
    |> Enum.map(fn member ->
      "#{member.timezone}[]=#{member.username}"
    end)
    |> Enum.join("&")
  end

  defp create_team_url(team, channel_id, channel_name) do
    frontend_url = Application.get_env(:timo, :frontend_url)
    token = get_workspace_token(team)

    timezone_list =
      Slack.Web.Conversations.members(channel_id, %{token: token})
      |> create_timezone_list(token)

    "#{frontend_url}/dynamic-team?#{timezone_list}&name=#{channel_name}"
  end

  def create_slack_access_token(attrs) do
    encrypted_token = attrs.token |> Encrypt.encrypt()
    attrs = attrs |> Map.put(:token, encrypted_token)

    %SlackAccessToken{}
    |> SlackAccessToken.changeset(attrs)
    |> Repo.insert()
  end

  def authorize_workspace(code) do
    client_id = Application.get_env(:timo, __MODULE__)[:client_id]
    client_secret = Application.get_env(:timo, __MODULE__)[:client_secret]

    slack_details = Slack.Web.Oauth.V2.access(client_id, client_secret, code)

    %{
      token: slack_details["access_token"],
      workspace: slack_details["team"]["id"]
    }
    |> create_slack_access_token()
  end

  def create_response(team, channel_id, channel_name) do
    url = create_team_url(team, channel_id, channel_name)

    Poison.encode!(%{
      "text" => "Generated link for Timo :calendar: <#{url}>",
      "response_type" => "in_channel"
    })
  end

  def get_workspace_url(workspace) do
    token = workspace.token |> Encrypt.decrypt()
    team = Slack.Web.Team.info(%{token: token}) |> get_in(["team"])

    "https://#{team["domain"]}.slack.com"
  end
end
