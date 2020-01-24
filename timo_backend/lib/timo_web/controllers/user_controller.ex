defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User
  #alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => %{"type" => "users", "attributes" => user_params}}) do
    username = user_params["username"]
    with {:ok, %User{} = user} <- API.get_user_by_username(username) do
      conn
      |> fetch_session()
      |> put_session("user_id", user.id)
      |> render("show.json-api", data: user)
    else
      nil -> create_render(conn, user_params)
    end
  end

  def show(conn, %{"id" => "me"}) do
    user_id =
      conn
      |> fetch_session()
      |> get_session("user_id")

    if !user_id do
      {:error, :not_found}
    else
      user = API.get_user(user_id)
      render(conn, "show.json-api", data: user)
    end
  end

  def show(conn, %{"id" => id}) do
    with %User{} = user <- API.get_user(id) do
      render(conn, "show.json-api", data: user)
    else
      _ -> {:error, :not_found}
    end
  end

  defp create_render(conn, user_params) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      conn
      |> fetch_session()
      |> put_session("user_id", user.id)
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json-api", data: user)
    end
  end
end
