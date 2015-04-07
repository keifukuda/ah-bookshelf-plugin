# ah-bookshelf-plugin

[Bookshelf](http://bookshelfjs.org/) plugin for [actionhero](http://www.actionherojs.com/)

[![Build Status][travis-image]][travis-url]
[![NPM package][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![devDependency Status][devdepstat-image]][devdepstat-url]
[![License][license-image]][license-url]


## Description

## Features

## Install

```
npm install --save ah-bookshelf-plugin
```

```
# Then add one of the following:
npm install --save pg
npm install --save mysql
npm install --save mariasql
npm install --save sqlite3
```

Be sure to enable the plugin within actionhero.
Add the `"ah-bookshelf-plugin"` to `config/plugins.js`.

```javascript
// config/plugins.js

"use strict";

module.exports = {
  "default": {
    general: function(api) {
      return {
        plugins: [
          "ah-bookshelf-plugin"
        ]
      };
    }
  },
  //...
}};
```

Be sure to enable the task for database.
Add the `require("ah-bookshelf-plugin/grunt")(grunt);` to `gruntfile.js`.

```javascript
// gruntfile.js

"use strict";

var grunt = require("grunt")
require("actionhero/grunt")(grunt);

// ah-bookshelf-plugin
require("ah-bookshelf-plugin/grunt")(grunt);
```


## Configuration

After installation, `bookshelf.js` is copied to the `config/plugins` directory.
Please correct.

```javascript
// config/plugins/bookshelf.js

"use strict";

module.exports = {
  "default": {
    bookshelf: function(api) {
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
  //...
};
```

## Model

After installation, `base.js` is copied to the `models` directory.
Please describe the basic class of models and collections to `base.js`.
Model is allowed to inherit the base class, and add to `api.models`.

```javascript
// models/base.js

"use strict";

module.exports = function(api) {

  // Base Model
  api.bookshelf.Model = api.bookshelf.Model.extend({

    hasTimestamps: true
    //...

  }, {

    find: function(id, options) {
      if (options == null) { options = {} }
      if (!options.require) { options.require = true }
      return this.forge({id: id}).fetch(options);
    }
    //...

  });


  // Base Collection
  api.bookshelf.Collection = api.bookshelf.Collection.extend({

    model: api.bookshelf.Model

  });

};
```

```javascript
// models/user.js

"use strict";

module.exports = function(api) {

  // User Model
  api.models.User = api.bookshelf.Model.extend({

    tableName: "users"
    //...

  }, {

    findByUsername: function(username, options) {
      if (options == null) { options = {} }
      if (!options.require) { options.require = true }
      return this.forge({username: username}).fetch(options);
    }
    //...

  });


  // User Collection
  api.models.Users = api.bookshelf.Collection.extend({

    model: api.models.User

  });

};
```

## Task

Create or delete a database, the execution of the migration, the creation of the initial data.

```
// grunt --help

              db:version  Show the current migration version
             db:rollback  Rollback the database
         db:migrate:make  Make migrate file (:name)
              db:migrate  Migrate the database
            db:seed:make  Make seed file (:name)
                 db:seed  Create the seed data
               db:create  Create the database
                 db:drop  Drop the database
        db:migrate:reset  Runs db:drop db:create db:migrate
                db:reset  Runs db:migrate:reset db:seed
```

## Migration

Using the database task to create a migration file.

```
grunt db:migrate:make:create_users

Running "db:migrate:make:users" (db:migrate:make) task
>> Make /path/to/project/database/migrations/20150210164757_create_users.js
```

Please edit.

```javascript
// database/migrations/20150210164757_create_users.js

"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(t) {
    t.increments();
    t.string("username");
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
```

Please run migrate task.

```javascript
grunt db:migrate
```


## Seed

Using the database task to create a seed file.

```
grunt db:seed:make:users

Running "db:seed:make:users" (db:seed:make) task
>> Make /path/to/project/database/seeds/users.js
```

Please edit.

```javascript
// database/seeds/users.js

"use strict";

exports.seed = function(knex, Promise) {
  return knex("users").insert({
    username: "ah-bookshelf-plugin",
    created_at: new Date(),
    updated_at: new Date()
  });
};
```

Please run seed task.

```javascript
grunt db:seed
```



## Usage

The api is exposed in `api.bookshelf` and `api.models` object.
`api.bookshelf` is an instance of the bookshelf.


```javascript
// actions/users.js

"use strict";

exports.index = {
  name: "users.index",
  description: "users.index",
  run: function(api, connection, next){
    api.models.User.fetchAll()
    .then(function(users) {
      connection.response.users = users;
      next(connection, true);
    })
    .catch(function(err) {
      connection.error = err;
      next(connection, true);
    });
  }
};
```



[npm-url]: https://npmjs.org/package/ah-bookshelf-plugin
[npm-image]: https://badge.fury.io/js/ah-bookshelf-plugin.svg

[travis-url]: http://travis-ci.org/keifukuda/ah-bookshelf-plugin
[travis-image]: https://secure.travis-ci.org/keifukuda/ah-bookshelf-plugin.svg?branch=master

[depstat-url]: https://david-dm.org/keifukuda/ah-bookshelf-plugin
[depstat-image]: https://david-dm.org/keifukuda/ah-bookshelf-plugin.svg

[devdepstat-url]: https://david-dm.org/keifukuda/ah-bookshelf-plugin#info=devDependencies
[devdepstat-image]: https://david-dm.org/keifukuda/ah-bookshelf-plugin/dev-status.svg

[license-url]: https://github.com/keifukuda/ah-bookshelf-plugin/blob/master/MIT-LICENSE.txt
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
