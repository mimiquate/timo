defmodule TimoWeb.SlackController do
  use TimoWeb, :controller

  alias Timo.Slack, as: SlackContext

  plug TimoWeb.Plugs.SlackVerify when action in [:handle_request]

  def handle_request(conn, %{"challenge" => challenge_code}) do
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
    with response <- SlackContext.create_response(team, channel_id, channel_name) do
      HTTPoison.post(response_url, response, [{"Content-Type", "application/json"}])

      send_resp(conn, 200, "")
    end
  end

  def handle_request(conn, _params) do
    send_resp(conn, 200, "")
  end

  def auth(conn, %{"code" => code}) do
    case SlackContext.authorize_workspace(code) do
      {:ok, workspace} ->
        url = workspace |> SlackContext.get_workspace_url()

        redirect(conn, external: url)

      _ ->
        send_resp(conn, 200, "")
    end
  end

  def auth(conn, _params) do
    send_resp(conn, 400, "slack app failed")
  end
end
