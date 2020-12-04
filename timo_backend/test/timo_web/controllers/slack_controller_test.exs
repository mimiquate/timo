defmodule TimoWeb.SlackControllerTest do
  use TimoWeb.ConnCase

  alias Timo.SlackContext

  setup do
    bypass = Bypass.open(port: 8000)
    {:ok, bypass: bypass}
  end

  test "send correct timo url to slack", %{conn: conn, bypass: bypass} do
    Bypass.expect(bypass, "POST", "/api/conversations.members", fn conn ->
      Plug.Conn.resp(conn, 200, slack_web_conversation_members_response())
    end)

    Bypass.expect(bypass, "POST", "/api/users.info", fn conn ->
      {:ok, body, conn} = Plug.Conn.read_body(conn)
      member = body |> URI.decode_query() |> get_in(["user"])

      Plug.Conn.resp(conn, 200, slack_web_users_info_response(member))
    end)

    Bypass.expect(bypass, "POST", "/commands/TEAM_ID_1/", fn conn ->
      {:ok, body, conn} = Plug.Conn.read_body(conn)
      text = body |> Poison.decode!() |> get_in(["text"])

      assert String.contains?(text, "Generated link for Timo :calendar:")

      assert String.contains?(
               text,
               "/dynamic-team?America/Los_Angeles[]=Test One&America/Montevideo[]=Test Two&America/Argentina[]=Test Three&name=general"
             )

      Plug.Conn.resp(conn, 200, "")
    end)

    token = :crypto.strong_rand_bytes(16) |> :base64.encode()

    SlackContext.create_slack_access_token(%{workspace: "TEAM_ID_1", token: token})

    slack_command_request = %{
      "user_id" => "USER_ID",
      "api_app_id" => "API_APP_ID",
      "channel_id" => "CHANNEL_ID",
      "channel_name" => "general",
      "command" => "/command",
      "team_domain" => "team_domain",
      "team_id" => "TEAM_ID_1",
      "token" => "#{token}",
      "response_url" => "localhost:8000/commands/TEAM_ID_1/"
    }

    post(conn, Routes.slack_path(conn, :handle_request, slack_command_request))
  end

  def slack_web_conversation_members_response() do
    Poison.encode!(%{
      "ok" => true,
      "members" => [
        "ID_MEMBER_1",
        "ID_MEMBER_2",
        "ID_MEMBER_3"
      ]
    })
  end

  def slack_web_users_info_response(member_id) do
    member =
      [
        %{
          id: "ID_MEMBER_1",
          real_name: "Test One",
          timezone: "America/Los_Angeles"
        },
        %{
          id: "ID_MEMBER_2",
          real_name: "Test Two",
          timezone: "America/Montevideo"
        },
        %{
          id: "ID_MEMBER_3",
          real_name: "Test Three",
          timezone: "America/Argentina"
        }
      ]
      |> Enum.find(fn m -> m.id == member_id end)

    Poison.encode!(%{
      "ok" => true,
      "user" => %{
        "id" => member.id,
        "team_id" => "TEAM_ID_1",
        "deleted" => false,
        "real_name" => member.real_name,
        "tz" => member.timezone,
        "is_bot" => false
      }
    })
  end
end
