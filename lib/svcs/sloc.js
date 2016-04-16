'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  insert(slocSet) {
    let set = new db.SlocSet(data);
    return set.save();
  }
};

// auto register
locator.register('slocset-service', module.exports);
