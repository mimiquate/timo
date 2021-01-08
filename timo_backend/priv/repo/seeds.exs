# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Timo.Repo.insert!(%Timo.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Timo.API.City
alias Timo.Repo

City
|> struct!(%{name: "Tokyo", country: "Japon", timezone: "Asia/Tokyo"})
|> Repo.insert!()

City
|> struct!(%{name: "Kyōto", country: "Japon", timezone: "Asia/Tokyo"})
|> Repo.insert!()

City
|> struct!(%{
  name: "Montevideo",
  country: "Uruguay",
  timezone: "America/Montevideo"
})
|> Repo.insert!()

City
|> struct!(%{
  name: "São Paulo",
  country: "Brazil",
  timezone: "America/Sao_Paulo"
})
|> Repo.insert!()

City
|> struct!(%{
  name: "Buenos Aires",
  country: "Argentina",
  timezone: "America/Argentina/Buenos_Aires"
})
|> Repo.insert!()

City
|> struct!(%{
  name: "Los Angeles",
  country: "United States",
  timezone: "America/Los_Angeles"
})
|> Repo.insert!()

City
|> struct!(%{
  name: "New York",
  country: "United States",
  timezone: "America/New_York"
})
|> Repo.insert!()

City
|> struct!(%{name: "Berlin", country: "Germany", timezone: "Europe/Berlin"})
|> Repo.insert!()

City
|> struct!(%{name: "Munich", country: "Germany", timezone: "Europe/Berlin"})
|> Repo.insert!()

City
|> struct!(%{
  name: "Stockholm",
  country: "Sweden",
  timezone: "Europe/Stockholm"
})
|> Repo.insert!()

City
|> struct!(%{name: "Malmö", country: "Sweden", timezone: "Europe/Stockholm"})
|> Repo.insert!()
