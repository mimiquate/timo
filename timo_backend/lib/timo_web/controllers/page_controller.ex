defmodule TimoWeb.PageController do
  use TimoWeb, :controller

  def home(conn, _params) do
    send_resp(conn, 200, "")
  end
end
