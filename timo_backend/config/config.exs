# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :timo,
  ecto_repos: [Timo.Repo]

# Configures the endpoint
config :timo, TimoWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: TimoWeb.ErrorView, accepts: ~w(json json-api), layout: false],
  pubsub_server: Timo.PubSub,
  cookie_signing_salt: "iKpGBV7H"

config :logger,
  backends: [:console, Sentry.LoggerBackend],
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :phoenix, :format_encoders, "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}

config :elixir, :time_zone_database, Tzdata.TimeZoneDatabase

config :timo, frontend_url: "http://localhost:4200"
config :timo, Timo.Token, account_verification_salt: "timoapp email account verification salt"

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
# config :timo, Timo.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
# config :swoosh, :api_client, false

config :sentry,
  dsn: System.get_env("SENTRY_DNS") || "https://public_key@app.getsentry.com/1",
  included_environments: [:prod],
  environment_name: config_env()

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
