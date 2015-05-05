"use strict";

process.env.NODE_ENV = 'test';

import "babel/polyfill";
import support from "source-map-support";
support.install();

import assert from "power-assert";
import { actionheroPrototype } from "actionhero";
import bookshelf from "../initializers/bookshelf";

import sqlite from "./config/sqlite";
import postgres from "./config/postgres";
import mysql from "./config/mysql";
import mariadb from "./config/mariadb";

var actionhero, api, db, User;
actionhero = new actionheroPrototype();


// [sqlite, postgres, mysql, mariadb].forEach( (config) => {
[sqlite, postgres, mysql].forEach( (config) => {

  describe("ah-bookshelf-plugin test for " + config.bookshelf.client, () => {

    beforeEach( (done) => {
      actionhero.start({configChanges: config}, (err, a) => {
        if (err) { return done(err); }
        api = a;

        // NOTE: ?????
        // api.config.bookshelf.migrations.directory = "./test/migrations";
        // api.config.bookshelf.seeds.directory = "./test/seeds";

        return bookshelf.initialize(api, () => {
          return bookshelf.start(api, () => {
            db = api.bookshelf.utils.db;
            User = api.models.User;
            return done();
          });
        });
      });
    });

    afterEach( (done) => {
      // initliazer.stop not running...
      if (api.bookshelf.utils.pool.live()) {
        api.bookshelf.knex.destroy( (err) => {
          actionhero.stop( (err) => {
            if (err) { return done(err); }
            return done();
          });
        });
      }
      else {
        actionhero.stop( (err) => {
          if (err) { return done(err); }
          return done();
        });
      }
    });


    it("config should be loaded", () => {
      assert.ok(api.config.bookshelf);
    });

    it("initializer should be loaded", () => {
      assert.ok(api.models);
      assert.ok(api.bookshelf);
      assert.ok(api.bookshelf.utils);
    });

    it("base model should be loaded", () => {
      assert.ok(api.bookshelf.Model.prototype.hasTimestamps);
    });

    it("user model should be loaded", () => {
      assert.ok(api.models.User);
    });

    describe("api.bookshelf.utils.db", () => {

      describe("#create()", () => {
        it("should be created", () => {
          return db.create();
        });
      });

      describe("#migrate.run()", () => {
        it("should be migrated", () => {
          return db.migrate.run();
        });
      });

      describe("#version()", () => {
        it("should be get current version", () => {
          return db.version();
        });
      });

      describe("#seed.run()", () => {
        it("should be seeded", () => {
          return db.seed.run();
        });
      });

      // describe("#rollback()", () => {
      //   it("should be rollbacked", () => {
      //     return db.rollback();
      //   });
      // });

      // describe("#drop()", () => {
      //   it("should be droped", () => {
      //     return db.drop();
      //   });
      // });

    });


    describe("api.models.User", () => {

      var username = "ah-bookshelf-plugin";

      it("should be fetched user", () => {
        return User.forge({id: 1}).fetch().then( (user) => {
          assert.ok(user.get("username") === username);
        });
      });

      it("should be used find by base class method", () => {
        return User.find(1).then( (user) => {
          assert.ok(user.get("username") === username);
        });
      });

      it("should be used findByUsername by user class method", () => {
        return User.findByUsername(username).then( (user) => {
          assert.ok(user.get("username") === username);
        });
      });
    });


    describe("api.bookshelf.utils.db", () => {

      describe("#rollback()", () => {
        it("should be rollbacked", () => {
          return db.rollback();
        });
      });

      describe("#drop()", () => {
        it("should be droped", () => {
          return db.drop();
        });
      });
    });

  });
});
