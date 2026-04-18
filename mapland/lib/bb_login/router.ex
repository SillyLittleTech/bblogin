defmodule BbLogin.Router do
  use Plug.Router

  plug Plug.Static,
    at: "/",
    from: {:bb_login, "priv/static"},
    gzip: false

  plug :match
  plug :dispatch

  get "/" do
    index_path =
      :bb_login
      |> :code.priv_dir()
      |> Path.join("static/index.html")

    conn
    |> put_resp_content_type("text/html")
    |> send_file(200, index_path)
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
