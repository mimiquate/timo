defmodule Timo.APITest do
  use Timo.DataCase

  alias Timo.API

  describe "users" do
    alias Timo.API.User

    @valid_attrs %{username: "some username"}
    @update_attrs %{username: "some updated username"}
    @invalid_attrs %{username: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> API.create_user()

      user
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert API.list_users() == [user]
    end

    test "/1 returns the user with given id" do
      user = user_fixture()
      assert API.get_user(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = API.create_user(@valid_attrs)
      assert user.username == "some username"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = API.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = API.update_user(user, @update_attrs)
      assert user.username == "some updated username"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = API.update_user(user, @invalid_attrs)
      assert user == API.get_user(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = API.delete_user(user)
      assert API.get_user(user.id) == nil
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = API.change_user(user)
    end

    test "get_user_by/1 return user with given params" do
      user = user_fixture()
      %{username: username} = user
      assert API.get_user_by(username: username) == user
    end

    test "get_user_by/1 returns nil when no user" do
      username = @valid_attrs.username
      assert API.get_user_by(username: username) == nil
    end

    test "get_user_by_username/1 returns user with given username" do
      user = user_fixture()
      %{username: username} = user
      {:ok, get_user} = API.get_user_by_username(username)
      assert get_user == user
    end

    test "get_user_by_username/1 returns nil when user is nil" do
      assert API.get_user_by_username(nil) == nil
    end
  end
end
