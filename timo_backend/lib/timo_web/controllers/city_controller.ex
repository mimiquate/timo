defmodule TimoWeb.CityController do
  use TimoWeb, :controller

  alias Timo.API

  action_fallback TimoWeb.FallbackController

  def index(conn, params) do
    cities = API.get_cities(params)
    render(conn, "index.json-api", data: cities)
  end
end
