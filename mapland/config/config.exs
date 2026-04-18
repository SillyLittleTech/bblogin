import Config

config :bb_login,
  port: String.to_integer(System.get_env("PORT") || "4000")
