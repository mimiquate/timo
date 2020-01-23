defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User
  alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def index(conn, _params) do
    users = API.list_users()
    render(conn, "index.json-api", data: users)
  end

  def create(conn, %{"data" => data = %{"type" => "user", "attributes" => user_params}}) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json-api", data: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = API.get_user!(id)
    render(conn, "show.json-api", data: user)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "user", "attributes" => user_params}}) do
    user = API.get_user!(id)

    with {:ok, %User{} = user} <- API.update_user(user, user_params) do
      render(conn, "show.json-api", data: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = API.get_user!(id)
    with {:ok, %User{}} <- API.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
