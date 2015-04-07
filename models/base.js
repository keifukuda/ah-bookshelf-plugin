"use strict";

module.exports = function(api) {

  // Base Model
  api.bookshelf.Model = api.bookshelf.Model.extend({

    hasTimestamps: true
    //...

  }, {

    find: function(id, options) {
      if (options == null) { options = {}; }
      if (!options.require) { options.require = true; }
      return this.forge({id: id}).fetch(options);
    }
    //...

  });


  // Base Collection
  api.bookshelf.Collection = api.bookshelf.Collection.extend({

    model: api.bookshelf.Model

  });

};
