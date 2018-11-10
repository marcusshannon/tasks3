defmodule Tracker.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :description, :string
    field :time, :integer
    field :title, :string
    field :complete, :boolean
    belongs_to :user, Tracker.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :description, :time, :user_id])
    |> validate_required([:title, :description])
  end
end
