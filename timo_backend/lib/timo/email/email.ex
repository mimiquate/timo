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
      <body style="font-family: Helvetica;">
        <table width="500px" border="0" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td style="padding: 109px 0px 65px 0px;">
              <img src="#{@timo_img_url}">
            </td>
          </tr>
          <tr>
            <td style="font-size: 25px; color: #000000;">
              <p>Hi #{user_name},</p>
            </td>
          </tr>
          <tr>
            <td style="font-size: 21px; color: #000000;">
              <p>We received a request to create an account with your email on Timo App.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 0px 28px 0px;">
              <a href="#{url}" style="display: inline-block; width: 223px; height=48px; text-align: center; line-height: 48px; text-decoration: none; font-family: Helvetica; font-size: 16px; color: white; background-color: #5C77F8; border-radius: 29px;">Verify email</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0px 0px 41px 0px; color: #000000;">Thank you,<br>Timo’s Team</td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #C4C4C4; padding: 19px 0px 30px 0px;">
              <span style="font-size: 13px; color: #5C5C5C;">Need help? Contact us: <a style="color: #5C77F8;" href="support@mimiquate.com">support@mimiquate.com</a></span>
            </td>
          </tr>
        </table>
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
