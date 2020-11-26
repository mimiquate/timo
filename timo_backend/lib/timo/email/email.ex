defmodule Timo.Email do
  use Bamboo.Phoenix, view: TimoWeb.EmailView

  @timo_img_url "http://cdn.mcauto-images-production.sendgrid.net/d80c9e6af85ef59e/b125447c-29c6-457a-9806-a448e5df3ae8/109x36.png"

  def verification_email(user_email, url, user_name) do
    email_assign = %{user_name: user_name, url: url, img: @timo_img_url}

    new_email()
    |> to(user_email)
    |> from("no-reply@timo.mimiquate.xyz")
    |> subject("Please verify your email address")
    |> put_text_layout({TimoWeb.EmailView, "email.text"})
    |> put_html_layout({TimoWeb.EmailView, "email.html"})
    |> assign(:email, email_assign)
    |> render(:email)
  end
end
