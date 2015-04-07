"use strict";

module.exports = function(api) {

  // User Model
  api.models.User = api.bookshelf.Model.extend({

    tableName: 'users'
    //...

  }, {

    findByUsername: function(username, options) {
      if (options == null) { options = {}; }
      if (!options.require) { options.require = true; }
      return this.forge({username: username}).fetch(options);
    }
    //...

  });


  // User Collection
  api.models.Users = api.bookshelf.Collection.extend({

    model: api.models.User

  });

};
