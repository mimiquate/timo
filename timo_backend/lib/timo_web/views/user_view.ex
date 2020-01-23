defmodule TimoWeb.UserView do
  use TimoWeb, :view
  use JaSerializer.PhoenixView
  
  attributes [:username, :inserted_at, :updated_at]
  
end
