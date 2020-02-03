defmodule TimoWeb.MemberController do
  use TimoWeb, :controller

  alias Timo.API
  alias Timo.API.Member
  alias JaSerializer.Params

  action_fallback TimoWeb.FallbackController

  def index(conn, _params) do
    members = API.list_members()
    render(conn, "index.json-api", data: members)
  end

  def create(conn, %{"data" => data = %{"type" => "member", "attributes" => member_params}}) do
    with {:ok, %Member{} = member} <- API.create_member(member_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.member_path(conn, :show, member))
      |> render("show.json-api", data: member)
    end
  end

  def show(conn, %{"id" => id}) do
    member = API.get_member!(id)
    render(conn, "show.json-api", data: member)
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "member", "attributes" => member_params}
      }) do
    member = API.get_member!(id)

    with {:ok, %Member{} = member} <- API.update_member(member, member_params) do
      render(conn, "show.json-api", data: member)
    end
  end

  def delete(conn, %{"id" => id}) do
    member = API.get_member!(id)

    with {:ok, %Member{}} <- API.delete_member(member) do
      send_resp(conn, :no_content, "")
    end
  end
end
