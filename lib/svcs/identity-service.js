'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  ensureIdentity(id) {
    return db.connect().then( conn => {
      return new Promise( (resolve, reject) => {
        let query = { email: id.email, name: id.name };

        // TODO: cache this maybe?
        db.Identity.findOneAndUpdate(query, id, { upsert: true }, (err, doc) => {
          if (err) return reject(err);
          resolve(doc);
        });
      });
    });
  }
};

// auto register
locator.register('identity-service', module.exports);
