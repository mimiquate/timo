defmodule TimoWeb.Plugs.SlackVerify do
  import Plug.Conn

  @slack_signing_secret Application.get_env(:timo, __MODULE__)[:slack_signing_secret]

  def init(options), do: options

  def call(conn, _opts) do
    if Mix.env() == :test || verified(conn) do
      conn
    else
      send_resp(conn, 400, "slack signature verification failed")
    end
  end

  defp verified(conn) do
    timestamp =
      conn
      |> get_req_header("x-slack-request-timestamp")
      |> Enum.at(0)
      |> String.to_integer()

    {:ok, datetime_timestamp} = DateTime.from_unix(timestamp)

    local_timestamp = DateTime.utc_now()

    if DateTime.compare(datetime_timestamp, DateTime.add(local_timestamp, 6000)) == :gt do
      false
    else
      body = conn.assigns[:raw_body]

      hmac =
        Base.encode16(
          :crypto.hmac(
            :sha256,
            @slack_signing_secret,
            "v0:#{timestamp}:#{body}"
          )
        )

      my_signature = String.downcase("v0=#{hmac}")

      [slack_signature] = conn |> get_req_header("x-slack-signature")

      Plug.Crypto.secure_compare(my_signature, slack_signature)
    end
  end
end
