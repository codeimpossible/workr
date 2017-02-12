'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  slocExists(sha) {
    return db.connect().then( conn => {
      return new Promise( (resolve, reject) => {
        db.SlocSet.find({sha}, (err, doc) => {
          if (err) return reject(err);
          resolve(doc);
        });
      });
    });
  },

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
