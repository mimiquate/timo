defmodule TimoWeb.CityControllerTest do
  use TimoWeb.ConnCase

  import Timo.APIFixtures

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all cities", %{conn: conn} do
      city_fixture(name: "Montevideo")
      conn = get(conn, ~p"/api/cities?search=Mont")
      [montevideo] = json_response(conn, 200)["data"]

      assert montevideo["name"] == "Montevideo"
    end
  end
end
