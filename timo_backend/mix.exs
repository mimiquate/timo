defmodule Timo.MixProject do
  use Mix.Project

  def project do
    [
      app: :timo,
      version: "0.1.0",
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Timo.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.6.9"},
      {:phoenix_pubsub, "~> 2.0"},
      {:phoenix_ecto, "~> 4.4"},
      {:phoenix_html, "~> 2.11"},
      {:ecto_sql, "~> 3.6"},
      {:postgrex, ">= 0.0.0"},
      {:gettext, "~> 0.18"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.5"},
      {:ja_serializer, "~> 0.15.0"},
      {:poison, "~> 3.1"},
      {:tzdata, "~> 1.0.3"},
      {:pbkdf2_elixir, "~> 1.0"},
      {:cors_plug, "~> 2.0"},
      {:bamboo, "~> 1.7"},
      {:sentry, "8.0.0"},
      {:certifi, "~> 2.8"},

      # Telemetry
      {:opentelemetry, "~> 1.0"},
      {:opentelemetry_api, "~> 1.0"},
      {:opentelemetry_ecto, "~> 1.0"},
      {:opentelemetry_phoenix, "~> 1.0"},
      {:opentelemetry_exporter, "~> 1.0", only: :prod}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
