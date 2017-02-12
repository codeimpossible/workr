'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  insert(data) {
    return db.connect().then( conn => {
      return new Promise( (resolve, reject) => {
        let set = new db.SlocSet(data);
        set.save( err => {
          if (err) return reject(err);
          resolve(set);
        });
      });
    });
  }
};

// auto register
locator.register('slocset-service', module.exports);
