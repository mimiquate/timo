defmodule TimoWeb.CityController do
  use TimoWeb, :controller

  alias Timo.API

  action_fallback TimoWeb.FallbackController

  def index(conn, params) do
    cities = API.list_cities(params)
    render(conn, :index, cities: cities)
  end
end
