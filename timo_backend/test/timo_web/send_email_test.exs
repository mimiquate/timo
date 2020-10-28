defmodule TimoWeb.SendEmailTest do
  use TimoWeb.ConnCase
  use Bamboo.Test

  alias TimoWeb.SendEmail

  test "sends verification email" do
    user = user_factory()
    verification_url = "localhost:4200/verify/S8jan.u4nJo7fenK93nANf3n9anf3"
    email = SendEmail.send_account_verification_email(user, verification_url)

    assert_delivered_email(email)

    assert email.from == {nil, "no-reply@timo.mimiquate.xyz"}
    assert email.to == [nil: "#{user.email}"]
    assert email.subject == "Please verify your email address"

    welcome_text = "We received a request to create an account with your email on Timo App."

    assert String.contains?(email.html_body, "#{user.username}")
    assert String.contains?(email.html_body, verification_url)
    assert String.contains?(email.html_body, welcome_text)

    assert String.contains?(email.text_body, "#{user.username}")
    assert String.contains?(email.text_body, verification_url)
    assert String.contains?(email.text_body, welcome_text)
  end
end
