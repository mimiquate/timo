defmodule TimoWeb.CityControllerTest do
  use TimoWeb.ConnCase

  setup %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    city_factory(%{name: "Āgra"})
    city_factory(%{name: "Ağrı"})
    cities = ["Āgra", "Ağrı"]

    conn = get(conn, Routes.city_path(conn, :index), %{"search" => "Agr"})

    [city_1, city_2] = json_response(conn, 200)["data"]

    assert city_1["type"] == "city"
    assert city_2["type"] == "city"
    assert Enum.member?(cities, city_1["attributes"]["name"])
    assert Enum.member?(cities, city_2["attributes"]["name"])
  end

  test "lists empty entries on index", %{conn: conn} do
    conn = get(conn, Routes.city_path(conn, :index), %{"search" => "Agr"})

    assert json_response(conn, 200)["data"] == []
  end
end
