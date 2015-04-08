"use strict";

export default {
  bookshelf: {
    client: "postgres",
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASSWORD || "",
      database: process.env.PG_DATABASE || "ah_bookshelf_plugin_test",
      charset: "utf8"
    }
  }
};
