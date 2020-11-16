defmodule TimoWeb.TeamChannel do
  use Phoenix.Channel

  def join("team", _message, socket) do
    {:ok, socket}
  end
end
