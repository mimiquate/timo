import Config

# Configure your database
config :timo, Timo.Repo,
  username: "postgres",
  password: "postgres",
  database: "timo_test#{System.get_env("MIX_TEST_PARTITION")}",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :timo, TimoWeb.Endpoint,
  http: [port: 4002],
  secret_key_base: "RpRII5vT7qZm1Pk5hhaaZ8gx1x3twM1h4Zui2fVlapMp3be3TwPfy8LSdUZtNATU",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :pbkdf2_elixir, :rounds, 1

config :timo, frontend_url: "http://localhost:4200"

config :timo, Timo.Mailer, adapter: Bamboo.TestAdapter
