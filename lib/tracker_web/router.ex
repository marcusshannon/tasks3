defmodule TrackerWeb.Router do
  use TrackerWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TrackerWeb do
    pipe_through :api

    resources "/users", UserController, only: [:create]

    post "/tokens", TokenController, :log_in

    pipe_through :authenticate

    resources "/users", UserController, except: [:new, :edit] do
      resources "/tasks", TaskController, only: [:index]
    end

    resources "/tasks", TaskController, except: [:new, :edit] do
      get("/increment", TaskController, :increment)
      get("/decrement", TaskController, :decrement)
      get("/complete", TaskController, :complete)
    end
  end

  scope "/", TrackerWeb do
    pipe_through :browser
    get "/*path", PageController, :index
  end

  def authenticate(conn, _) do
    case Plug.Conn.get_req_header(conn, "authorization") do
      [] ->
        conn
        |> Plug.Conn.put_status(403)
        |> Phoenix.Controller.json(%{error: "Unauthorized"})

      [token] ->
        case Phoenix.Token.verify(
               TrackerWeb.Endpoint,
               "XMqYGm+0LFs4qLpKDIRDwShL1uFpSKSDXa/4ECvAshJvM8spTxxKrg4H5yWO8Cto",
               token
             ) do
          {:ok, user_id} ->
            conn
            |> Plug.Conn.assign(:current_user, Tracker.Users.get_user!(user_id))

          {:error, _} ->
            conn
            |> Plug.Conn.put_status(403)
            |> Phoenix.Controller.json(%{error: "Unauthorized"})
        end
    end
  end
end
