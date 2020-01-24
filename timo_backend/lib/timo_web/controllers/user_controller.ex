defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User
  #alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => %{"type" => "users", "attributes" => user_params}}) do
    username = user_params["username"]
    with {:ok, %User{} = user} <- API.get_user_by_username(username) do
      render(conn, "show.json-api", data: user)
    else
      nil -> create_render(conn, user_params)
    end
  end

  def show(conn, %{"id" => id}) do
    user = API.get_user!(id)
    render(conn, "show.json-api", data: user)
  end

  defp create_render(conn, user_params) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json-api", data: user)
    end
  end
end
