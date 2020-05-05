defmodule Timo.Email do
  import Bamboo.Email

  def verification_email(user_email, url) do
    new_email(
      to: user_email,
      from: "account-verification@timoapp.com",
      subject: "Please verify your email address",
      html_body:
        "<h1>Timo App</h1>" <>
          "<h2>Please verify your email address</h2>" <>
          "<p>Click link to verify email: <a href=#{url}>#{url}</a></p>",
      text_body: "Timo App Please verify your email address Click link to verify email: " <> url
    )
  end
end
