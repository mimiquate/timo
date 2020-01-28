defmodule Timo.Repo do
  use Ecto.Repo,
    otp_app: :timo,
    adapter: Ecto.Adapters.Postgres
end
