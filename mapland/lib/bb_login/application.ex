defmodule BbLogin.Application do
  use Application

  @impl true
  def start(_type, _args) do
    port = Application.fetch_env!(:bb_login, :port)

    children = [
      {Plug.Cowboy, scheme: :http, plug: BbLogin.Router, options: [port: port]}
    ]

    opts = [strategy: :one_for_one, name: BbLogin.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
