'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  insert(data) {
    return db.connect().then( conn => {
      let commit = new db.Commit(data);
      return commit.save().then(() => console.log(data, 'saved!'));
    });
  }
};

// auto register
locator.register('commit-service', module.exports);
