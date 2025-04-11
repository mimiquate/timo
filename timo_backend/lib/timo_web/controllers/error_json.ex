defmodule TimoWeb.ErrorJSON do
  @moduledoc """
  This module is invoked by your endpoint in case of errors on JSON requests.

  See config/config.exs.
  """

  # If you want to customize a particular status code,
  # you may add your own clauses, such as:
  #
  # def render("500.json", _assigns) do
  #   %{errors: %{detail: "Internal Server Error"}}
  # end

  # By default, Phoenix returns the status message from
  # the template name. For example, "404.json" becomes
  # "Not Found".

  def render("invalid_password_user.json", _assigns) do
    JaSerializer.ErrorSerializer.format(%{
      status: "400",
      title: "Invalid username or password",
      detail: "User doesn\'t exists or incorrect password"
    })
  end

  def render("invalid_token.json", _assigns) do
    JaSerializer.ErrorSerializer.format(%{
      status: "400",
      title: "Invalid token",
      detail: "Verification token doesn\'t exists"
    })
  end

  def render("email_not_verified.json", _assigns) do
    JaSerializer.ErrorSerializer.format(%{
      status: "400",
      title: "Email not verified",
      detail: "Email must be verified to access account"
    })
  end

  def render(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end
end
