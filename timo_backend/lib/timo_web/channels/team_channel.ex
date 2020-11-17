defmodule TimoWeb.TeamChannel do
  use Phoenix.Channel

  def join("team:" <> team_id, _message, socket) do
    {:ok, socket}
  end
end
