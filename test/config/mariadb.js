"use strict";

export default {
  bookshelf: {
    client: "mariadb",
    connection: {
      host: process.env.MARIADB_HOST || "127.0.0.1",
      port: process.env.MARIADB_PORT || 3306,
      user: process.env.MARIADB_USER || "root",
      password: process.env.MARIADB_PASSWORD || "",
      database: process.env.MARIADB_DATABASE || "ah_bookshelf_plugin_test",
      charset: "utf8"
    }
  }
};
