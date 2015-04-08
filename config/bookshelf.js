"use strict";

module.exports = {
  "default": {
    bookshelf: function bookshelf(api) {
      return {
        // http://knexjs.org/#Installation-debug
        debug: true,

        // http://knexjs.org/#Installation-client
        client: "postgres",
        connection: {
          host: "127.0.0.1",
          port: 5432,
          user: "postgres",
          password: "postgres",
          database: "db_development",
          charset: "utf8"
        },

        // http://knexjs.org/#Installation-migrations
        migrations: {
          tableName: "knex_migrations",
          directory: api.projectRoot + "/database/migrations"
        },

        // http://knexjs.org/#Seeds-API
        seeds: {
          directory: api.projectRoot + "/database/seeds"
        },

        // models directory
        models: {
          directory: api.projectRoot + "/models"
        }
      };
    }
  },

  production: {
    bookshelf: function bookshelf(api) {
      return {
        debug: false,
        connection: {
          host: "127.0.0.1",
          port: 5432,
          user: "postgres",
          password: "postgres",
          database: "db_production",
          charset: "utf8"
        }
      };
    }
  },

  test: {
    bookshelf: function bookshelf(api) {
      return {
        debug: false,
        client: "sqlite3",
        connection: {
          host: "127.0.0.1",
          port: 5432,
          user: "postgres",
          password: "postgres",
          database: "db_test",
          charset: "utf8"
        }
      };
    }
  }
};
