defmodule TimoWeb.SendEmail do
  def user_verification_url(token) do
    {:ok, frontend_url} = Application.fetch_env(:timo, :frontend_url)
    frontend_url <> "/verify/" <> token
  end

  def send_account_verification_email(%Timo.API.User{} = user, verification_url) do
    Timo.Email.verification_email(user.email, verification_url, user.username)
    |> Timo.Mailer.deliver_now()
  end
end
