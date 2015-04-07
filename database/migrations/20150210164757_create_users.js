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
