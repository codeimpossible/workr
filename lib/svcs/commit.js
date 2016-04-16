'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  insert(data) {
    let commit = new db.Commit(data);
    return commit.save();
  }
};

// auto register
locator.register('commit-service', module.exports);
