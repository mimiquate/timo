defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => %{"type" => "users", "attributes" => user_params}}) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json-api", data: user)
    end
  end

  def show(conn, %{"id" => "me"}) do
    user_id =
      conn
      |> get_session("user_id")

    if !user_id do
      {:error, :unauthorized}
    else
      {:ok, %User{} = user} = API.get_user(user_id)
      render(conn, "show.json-api", data: user)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, %User{} = user} <- API.get_user(id) do
      render(conn, "show.json-api", data: user)
    else
      _ -> {:error, :not_found}
    end
  end
end
