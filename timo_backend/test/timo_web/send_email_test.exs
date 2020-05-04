defmodule TimoWeb.SendEmailTest do
  use TimoWeb.ConnCase
  use Bamboo.Test

  alias TimoWeb.SendEmail

  test "sends verification email" do
    user = user_factory()
    verification_url = "localhost:4200/verify/S8jan.u4nJo7fenK93nANf3n9anf3"
    email = SendEmail.send_account_verification_email(user, verification_url)

    assert_delivered_email(email)
  end
end
