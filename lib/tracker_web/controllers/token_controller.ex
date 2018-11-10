defmodule TrackerWeb.TokenController do
  use TrackerWeb, :controller

  alias Tracker.Users

  action_fallback TrackerWeb.FallbackController

  def log_in(conn, %{"user" => %{"username" => username, "password" => password}}) do
    case Users.get_user_by_username(username)
         |> Comeonin.Bcrypt.check_pass(password) do
      {:ok, user} ->
        conn
        |> json(%{
          id: user.id,
          token:
            Phoenix.Token.sign(
              TrackerWeb.Endpoint,
              "XMqYGm+0LFs4qLpKDIRDwShL1uFpSKSDXa/4ECvAshJvM8spTxxKrg4H5yWO8Cto",
              user.id
            )
        })

      _ ->
        conn
        |> put_status(401)
        |> json(%{
          error: "Invalid login"
        })
    end
  end
end
