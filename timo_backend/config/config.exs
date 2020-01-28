# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :timo,
  ecto_repos: [Timo.Repo]

# Configures the endpoint
config :timo, TimoWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "RpRII5vT7qZm1Pk5hhaaZ8gx1x3twM1h4Zui2fVlapMp3be3TwPfy8LSdUZtNATU",
  render_errors: [view: TimoWeb.ErrorView, accepts: ~w(json json-api)],
  pubsub: [name: Timo.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :phoenix, :format_encoders, "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
