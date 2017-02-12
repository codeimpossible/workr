'use strict';

const os = require('os');
const locator = require('./../service-locator');
const db = require('./../data');
const config = require('./../config');

module.exports = {
  register() {
    return db.connect().then( conn => {
      return new Promise( (resolve, reject) => {
        let query = { clientId: config.client_id };
        db.WorkrClient.findOneAndUpdate(query, {
          clientId: config.client_id,
          hostname: os.hostname(),
          os: `${os.type()}${os.arch()}`,
          stats: {
            totalmem: os.totalmem(),
            cpus: os.cpus().length
          }
        }, { upsert: true }, (err, doc) => {
          if (err) return reject(err);
          resolve(doc);
        });
      });
    });
  }
};

// auto register
locator.register('workr-client-service', module.exports);
