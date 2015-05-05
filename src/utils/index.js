"use strict";

import "babel/polyfill";
import Knex from "knex";

export default function(api) {

  return {

    pool: {
      live() {
        var pool = api.bookshelf.knex.client.pool || { live: false };
        pool = pool.live === undefined ? false : pool.live;
        return pool;
      }
    },

    db: {
      version: function() {
        return api.bookshelf.knex.migrate.currentVersion();
      },


      rollback: function() {
        return api.bookshelf.knex.migrate.rollback();
      },


      migrate: {
        make: function(name) {
          if (name === null) {
            return Promise.reject("The file name is required.");
          }
          return api.bookshelf.knex.migrate.make(name);
        },
        run: function() {
          return api.bookshelf.knex.migrate.latest();
        }
      },


      seed: {
        make: function(name) {
          if (name === null) {
            return Promise.reject("The file name is required.");
          }
          return api.bookshelf.knex.seed.make(name);
        },
        run: function() {
          return api.bookshelf.knex.seed.run();
        }
      },


      create: function() {
        var _knex, config, knex, sql;
        knex = api.bookshelf.knex;
        sql = "create database " + api.config.bookshelf.connection.database;

        switch (api.config.bookshelf.client) {
        case "sqlite":
        case "sqlite3":
          return Promise.resolve();

        case "pg":
        case "postgres":
        case "postgresql":
          sql += " template template0";
          config = JSON.parse(JSON.stringify(api.config.bookshelf));
          config.connection.database = "template1";

          // 別のDBに接続後、データベースを作成
          _knex = Knex(config);
          return _knex.raw(sql).then(_knex.destroy);

        case "mysql":
        case "mysql2":
        case "maria":    // Only MariaDB error
        case "mariadb":  // Error: No database selected
        case "mariasql": // https://github.com/tgriesser/bookshelf/issues/415
          config = JSON.parse(JSON.stringify(api.config.bookshelf));
          config.connection.database = "information_schema";

          // 別のDBに接続後、データベースを作成
          _knex = Knex(config);
          return _knex.raw(sql).then(_knex.destroy);

        default:
          return knex.raw(sql);
        };
      },


      drop: function() {
        var _knex, config, knex, sql;
        knex = api.bookshelf.knex;
        sql = "drop database " + api.config.bookshelf.connection.database;

        switch (api.config.bookshelf.client) {
        case "sqlite":
        case "sqlite3":
          // TODO: remove file
          return Promise.resolve();

        case "pg":
        case "postgres":
        case "postgresql":
          config = JSON.parse(JSON.stringify(api.config.bookshelf));
          config.connection.database = "template1";

          // 別のDBに接続後、データベースを削除
          _knex = Knex(config);
          return knex.destroy().then(() => {
            return _knex.raw(sql).then(_knex.destroy);
          });

        case "mysql":
        case "mysql2":
        case "maria":
        case "mariadb":
        case "mariasql":
          config = JSON.parse(JSON.stringify(api.config.bookshelf));
          config.connection.database = "information_schema";

          // 別のDBに接続後、データベースを削除
          _knex = Knex(config);
          return knex.destroy().then(() => {
            return _knex.raw(sql).then(_knex.destroy);
          });

        default:
          return knex.raw(sql);
        };
      }
    }

  };
};
