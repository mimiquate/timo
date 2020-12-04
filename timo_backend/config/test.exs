use Mix.Config

# Configure your database
config :timo, Timo.Repo,
  username: "postgres",
  password: "postgres",
  database: "timo_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :timo, TimoWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :pbkdf2_elixir, :rounds, 1

config :timo, frontend_url: "http://localhost:4200"
config :slack, url: "http://localhost:8000"

config :timo, Timo.Slack.Encrypt,
  encrypt_secret_key: "0qteK5zjIHiAoFuFLh97cw=="

config :timo, Timo.Mailer, adapter: Bamboo.TestAdapter
