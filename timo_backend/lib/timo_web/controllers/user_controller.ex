defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => %{"type" => "users", "attributes" => user_params}}) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      token = Timo.Token.generate_new_account_token(user)
      verification_url = TimoWeb.SendEmail.user_verification_url(token)
      TimoWeb.SendEmail.send_account_verification_email(user, verification_url)

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

  def verify_email(conn, %{"token" => token}) do
    with {:ok, user_id} <- Timo.Token.verify_new_account_token(token),
         {:ok, %User{verified: false} = user} <- API.get_user(user_id) do
      Timo.API.mark_as_verified(user)

      conn
      |> json(%{})
    else
      _ ->
        conn
        |> put_status(:bad_request)
        |> put_view(TimoWeb.ErrorView)
        |> render("invalid_token.json")
    end
  end
end
