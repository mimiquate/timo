defmodule TimoWeb.SessionController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User

  action_fallback TimoWeb.FallbackController

  def logout(conn, _params) do
    conn
    |> delete_session("user_id")
    |> json(%{})
  end

  def create(conn, %{"password" => password, "username" => username}) do
    with {:ok, %User{} = user} <- API.get_user_by_username(username),
         {:ok, _valid_user} <- Pbkdf2.check_pass(user, password) do
      conn
      |> put_session("user_id", user.id)
      |> json(%{})
    else
      nil ->
        {:error, :not_found}

      {:error, "invalid password"} ->
        conn
        |> put_status(:bad_request)
        |> put_view(TimoWeb.ErrorView)
        |> render("invalid_password.json")
    end
  end
end
