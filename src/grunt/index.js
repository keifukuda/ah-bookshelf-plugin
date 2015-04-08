"use strict";

import "babel/polyfill";

export default function(grunt) {
  grunt.registerTask('db:version', 'Show the current migration version', function() {
    var done;
    done = this.async();
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.version().then(function(version) {
        grunt.log.oklns("Migrate version: " + version);
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:rollback', 'Rollback the database', function() {
    var done;
    done = this.async();
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.version().then(function(oldVersion) {
        return api.bookshelf.utils.db.rollback().then(function() {
          return api.bookshelf.utils.db.version().then(function(newVersion) {
            grunt.log.oklns(oldVersion + " to " + newVersion);
            return done();
          });
        });
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:migrate:make', 'Make migrate file (:name)', function(name) {
    var done;
    done = this.async();
    if (name == null) {
      return done(new Error("The file name is required.\nExample: grunt db:migrate:make:create_users"));
    }
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.migrate.make(name).then(function(name) {
        grunt.log.oklns("Make " + name);
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:migrate', 'Migrate the database', function() {
    var done;
    done = this.async();
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.migrate.run().then(function() {
        grunt.log.oklns("Migrate database " + api.config.bookshelf.connection.database + ".");
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:seed:make', 'Make seed file (:name)', function(name) {
    var done;
    done = this.async();
    if (name == null) {
      return done(new Error("The file name is required.\nExample: grunt db:seed:make:countries"));
    }
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.seed.make(name).then(function(name) {
        grunt.log.oklns("Make " + name);
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:seed', 'Create the seed data', function() {
    var done;
    done = this.async();
    return grunt.startActionhero(function(api) {
      return api.bookshelf.utils.db.seed.run().then(function() {
        grunt.log.oklns("Seed database " + api.config.bookshelf.connection.database + ".");
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:create', 'Create the database', function() {
    var done, ok;
    done = this.async();
    return grunt.startActionhero(function(api) {
      var ok = "Create database " + api.config.bookshelf.connection.database + ".";
      return api.bookshelf.utils.db.create().then(function() {
        grunt.log.oklns(ok);
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:drop', 'Drop the database', function() {
    var done, ok;
    done = this.async();
    return grunt.startActionhero(function(api) {
      ok = "Drop database " + api.config.bookshelf.connection.database + ".";
      return api.bookshelf.utils.db.drop().then(function() {
        grunt.log.oklns(ok);
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  grunt.registerTask('db:migrate:reset', 'Runs db:drop db:create db:migrate', ['db:drop', 'db:create', 'db:migrate']);
  grunt.registerTask('db:reset', 'Runs db:migrate:reset db:seed', ['db:migrate:reset', 'db:seed']);

  return true;
};
