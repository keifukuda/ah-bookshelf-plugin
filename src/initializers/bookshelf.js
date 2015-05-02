"use strict";

import "babel/polyfill";
import fs from "fs";
import path from "path";
import Knex from "knex";
import Bookshelf from "bookshelf";
import utils from "../utils";
import defaultConfig from "../config/bookshelf";

export default {
  loadPriority:  1000,
  startPriority: 1000,
  stopPriority:  1000,

  initialize: function(api, next) {
    var basefiles, config, files, loadFile, regex;

    // namespace
    api.models = {};
    api.bookshelf = {};

    if (defaultConfig[api.env]) {
      api.config.bookshelf = api.utils.hashMerge(defaultConfig[api.env].bookshelf(api), api.config.bookshelf);
    }
    else {
      api.config.bookshelf = api.utils.hashMerge(defaultConfig.default.bookshelf(api), api.config.bookshelf);
    }

    config = api.config.bookshelf;

    // 初期化
    api.bookshelf = Bookshelf(Knex(config));

    // モデルファイル読み込みとファイル変更の監視
    loadFile = function(file) {
      api.log("model loaded: " + file, "debug");
      delete require.cache[require.resolve(file)];

      // NOTE: es6.models は動的読み込みに対応していない
      (require(file))(api);

      api.watchFileAndAct(file, function() {
        api.log("\r\n\r\n*** rebooting due to model change (" + file + ") ***\r\n\r\n", "info");
        return api.commands.restart.call(api._self);
      });
    };

    // モデルディレクトリのファイル一覧取得
    files = fs.readdirSync(config.models.directory);
    files = files.filter( (file) => file.indexOf(".") !== 0 );
    files = files.map( (file) => path.resolve(config.models.directory, file) );

    // ベースファイルの読み込み
    regex = /\/base\./;
    basefiles = files.filter( (file) => regex.test(file) );
    basefiles.forEach( (file) => loadFile(file) );
    files = files.filter( (file) => !(regex.test(file)) );
    files.forEach( (file) => loadFile(file) );

    // ユーティリティー読み込み
    api.bookshelf.utils = utils(api);

    return next();
  },

  start: function(api, next) {
    return next();
  },

  stop: function(api, next) {
    return api.bookshelf.knex.destroy(next);
  }
};
