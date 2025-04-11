defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API

  describe "cities" do
    import Timo.APIFixtures

    test "list_cities/0 returns all cities" do
      city = city_fixture(name: "Montevideo")
      assert API.list_cities(%{"search" => "mon"}) == [city]
    end
  end
end
