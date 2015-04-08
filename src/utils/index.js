"use strict";

import "babel/polyfill";

export default function(api) {

  return {

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
        var config, knex, sql;
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
          return knex.destroy().then(() => {
            knex = require("knex")(config);
            return knex.raw(sql).then(() => {
              // NOTE: destroy() を実行しているので、genericPool が Undefined の為、
              //       新規インスタンスの genericPool を代入。
              // Error: The genericPool is not initialized.
              api.bookshelf.knex.client.pool.genericPool = knex.client.pool.genericPool;
            });
            // .catch((err) => {
            //   /*
            //    { [error: database "ah_bookshelf_plugin_test" already exists]
            //    name: 'error',
            //    length: 100,
            //    severity: 'ERROR',
            //    code: '42P04',
            //    detail: undefined,
            //    hint: undefined,
            //    position: undefined,
            //    internalPosition: undefined,
            //    internalQuery: undefined,
            //    where: undefined,
            //    schema: undefined,
            //    table: undefined,
            //    column: undefined,
            //    dataType: undefined,
            //    constraint: undefined,
            //    file: 'dbcommands.c',
            //    line: '443',
            //    routine: 'createdb' }
            //    */

            //   // データベースがすでに存在する場合
            //   if (err.code === '42P04') {
            //     api.bookshelf.knex.client.pool.genericPool = knex.client.pool.genericPool;
            //     return Promise.resolve();
            //   }
            //   else {
            //     return Promise.reject();
            //   }
          });

        case "mysql":
        case "mysql2":
        case "maria":
        case "mariadb":
        case "mariasql":
          // sql = sql.replace("create database", "create database if not exists");
          return knex.raw(sql);

        default:
          return knex.raw(sql);
        };
      },


      drop: function() {
        var config, knex, sql;
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
          return knex.destroy().then(() => {
            knex = require("knex")(config);
            return knex.raw(sql).then(() => {
              // NOTE: destroy() を実行しているので、genericPool が Undefined の為、
              //       新規インスタンスの genericPool を代入。
              // Error: The genericPool is not initialized.
              api.bookshelf.knex.client.pool.genericPool = knex.client.pool.genericPool;
            });
          });

        case "mysql":
        case "mysql2":
        case "maria":
        case "mariadb":
        case "mariasql":
          // sql = sql.replace("drop database", "drop database if exists");
          return knex.raw(sql);

        default:
          return knex.raw(sql);
        };
      }
    }

  };
};
