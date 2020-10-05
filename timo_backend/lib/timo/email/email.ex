defmodule Timo.Email do
  import Bamboo.Email

  @timo_img_url "http://cdn.mcauto-images-production.sendgrid.net/d80c9e6af85ef59e/b125447c-29c6-457a-9806-a448e5df3ae8/109x36.png"

  def verification_email(user_email, url, user_name) do
    new_email(
      to: user_email,
      from: "no-reply@timo.mimiquate.xyz",
      subject: "Please verify your email address",
      html_body: custom_html_body(user_name, url),
      text_body: custom_text_body(user_name, url)
    )
  end

  defp custom_html_body(user_name, url) do
    """
    <html>
      <head>
        <title></title>
      </head>
      <body style="font-family:Helvetica; margin: 0; display: flex; justify-content: center; align-items: center;">
        <div style="background-color: #FFFFFF; width: 54vh; max-width: 685px; max-height: 619px;">
          <div style="margin: 109px 10px 65px 10px;"><img src="#{@timo_img_url}"></div>
          <div style="margin: 0px 10px;">
            <p style="font-size: 25px;">Hi #{user_name},</p>
            <p style="font-size: 21px;">We received a request to create an account with your email on Timo App.</p>
          </div>
          <form action="#{url}" style="margin: 40px 10px 24px 10px;">
            <button type="submit" style="font-family: Helvetica; font-size: 16px; color: white; background-color: #5C77F8; border-radius: 29px; border: none; outline: none; padding: 16px 70px;">Verify email</button>
          </form>
          <div style="margin: 0px 10px;">Thank you,<br>Timo’s Team</div>
          <div style="padding-top: 19px; margin: 41px 10px 30px 10px; font-size: 13px; color: #5C5C5C; border-top: 1px solid #C4C4C4;">Need help? Contact us: <a style="color: #5C77F8;" href="support@mimiquate.com">support@mimiquate.com</a></div>
        </div>
      </body>
    </html>
    """
  end

  defp custom_text_body(user_name, url) do
    """
    Timo

    Hi #{user_name},

    We received a request to create an account with your email on Timo App.

    Verify email
    #{url}

    Thank you,
    Timo’s Team

    Need help? Contact us: support@mimiquate.com
    """
  end
end
