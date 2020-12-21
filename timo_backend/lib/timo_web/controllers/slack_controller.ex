defmodule TimoWeb.SlackController do
  use TimoWeb, :controller

  alias Timo.Slack, as: SlackContext

  plug TimoWeb.Plugs.SlackVerify when action in [:handle_request]

  def handle_request(conn, params = %{"challenge" => challenge_code}) do
    send_resp(
      conn,
      200,
      Poison.encode!(%{
        "challenge" => challenge_code
      })
    )
  end

  def handle_request(conn, %{
    "channel_id" => channel_id,
    "channel_name" => channel_name,
    "team_id" => team,
    "response_url" => response_url
  }) do
    frontend_url = Application.get_env(:timo, :frontend_url)

    token = SlackContext.get_workspace_token(team)

    timezone_list =
      Slack.Web.Conversations.members(channel_id, %{token: token})
      |> create_timezone_list(token)

    slack_team_url =
      "#{frontend_url}/dynamic-team?#{timezone_list}&name=#{channel_name}"

    block =
      Poison.encode!(%{
        "text" => "Generated link for Timo :calendar: <#{slack_team_url}>",
        "response_type" => "in_channel"
      })

    HTTPoison.post(response_url, block, [{"Content-Type", "application/json"}])
    send_resp(conn, 200, "")
  end

  def handle_request(conn, _params) do
    send_resp(conn, 200, "")
  end

  def auth(conn, %{"code" => code}) do
    client_id = Application.get_env(:timo, __MODULE__)[:client_id]
    client_secret = Application.get_env(:timo, __MODULE__)[:client_secret]

    slack_details = Slack.Web.Oauth.V2.access(client_id, client_secret, code)

    %{
      token: slack_details["access_token"],
      workspace: slack_details["team"]["id"]
    }
    |> SlackContext.create_slack_access_token()
    |> case do
      {:ok, _} ->
        info = Slack.Web.Team.info(%{token: slack_details["access_token"]})

        redirect(conn, external: "https://#{info["team"]["domain"]}.slack.com")

      _ ->
        send_resp(conn, 200, "")
    end
  end

  def auth(conn, _params) do
    send_resp(conn, 400, "slack app failed")
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
end
