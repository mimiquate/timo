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
         {:ok, _valid_user} <- Pbkdf2.check_pass(user, password),
         true <- user.verified do
      conn
      |> put_session("user_id", user.id)
      |> json(%{})
    else
      false ->
        conn
        |> put_status(:bad_request)
        |> put_view(TimoWeb.ErrorView)
        |> render("email_not_verified.json")

      _error ->
        conn
        |> put_status(:bad_request)
        |> put_view(TimoWeb.ErrorView)
        |> render("invalid_password_user.json")
    end
  end
end
