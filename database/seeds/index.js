"use strict";

exports.seed = function(knex, Promise) {
  return knex("users").insert({
    username: "ah-bookshelf-plugin",
    created_at: new Date(),
    updated_at: new Date()
  });
};
