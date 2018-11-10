defmodule TrackerWeb.TaskView do
  use TrackerWeb, :view
  alias TrackerWeb.TaskView

  def render("index.json", %{tasks: tasks}) do
    IO.inspect(tasks)
    %{data: render_many(tasks, TaskView, "task.json")}
  end

  def render("show.json", %{task: task}) do
    %{data: render_one(task, TaskView, "task.json")}
  end

  def render("task.json", %{task: %{user: %Tracker.Users.User{}} = task}) do
    %{
      id: task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      complete: task.complete,
      user: render_one(task.user, TrackerWeb.UserView, "user.json")
    }
  end

  def render("task.json", %{task: task}) do
    %{
      id: task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      complete: task.complete
    }
  end
end
