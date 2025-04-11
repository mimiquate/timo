defmodule TimoWeb.UserController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.User

  action_fallback TimoWeb.FallbackController

  def create(conn, %{"data" => %{"type" => "users", "attributes" => user_params}}) do
    with {:ok, %User{} = user} <- API.create_user(user_params) do
      Timo.UserEmail.verification(user)
      |> Timo.Mailer.deliver()

      conn
      |> put_view(TimoWeb.UserJSON)
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/users/#{user}")
      |> render(:show, data: user)
    end
  end

  def show(conn, %{"id" => "me"}) do
    user_id = conn |> get_session("user_id")

    if !user_id do
      {:error, :unauthorized}
    else
      %User{} = user = API.get_user(user_id)

      conn
      |> put_view(TimoWeb.UserJSON)
      |> render(:show, data: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = API.get_user!(id)
    render(conn, :show, user: user)
  end

  def update(conn, %{"id" => "me", "token" => token}) do
    with {:ok, user_id} <- Timo.Token.verify_new_account_token(token),
         %User{verified: false} = user <- API.get_user(user_id) do
      {:ok, user} = Timo.API.mark_as_verified(user)

      conn
      |> put_view(TimoWeb.UserJSON)
      |> render(:show, data: user)
    end
  end
end
