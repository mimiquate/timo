defmodule Timo.Token do
  @account_verification_salt "timoapp email account verification salt"
  @one_week 604_800

  def generate_new_account_token(%Timo.API.User{id: user_id}) do
    Phoenix.Token.sign(TimoWeb.Endpoint, @account_verification_salt, user_id)
  end

  def verify_new_account_token(token) do
    max_age = @one_week
    Phoenix.Token.verify(TimoWeb.Endpoint, @account_verification_salt, token, max_age: max_age)
  end
end
