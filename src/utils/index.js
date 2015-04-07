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
          if (name == null) {
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
          if (name == null) {
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
          return knex.destroy().then(function() {
            knex = require("knex")(config);
            return knex.raw(sql);
          });

        default:
          return knex.raw(sql).then(function() {
            return knex.destroy();
          });
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
          return knex.destroy().then(function() {
            knex = require("knex")(config);
            return knex.raw(sql);
          });

        default:
          return knex.raw(sql).then(function() {
            return knex.destroy();
          });
        };
      }
    }

  };
};
