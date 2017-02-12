'use strict';

const locator = require('./../service-locator');
const db = require('./../data');

module.exports = {
  insert(data) {
    let idsvc = locator.resolve('identity-service');
    return db.connect().then( conn => {
      return Promise.all([
        idsvc.ensureIdentity(data.author),
        idsvc.ensureIdentity(data.committer)
      ])
      .then( ids => {
        data.author = ids[0] ? ids[0]._id : null;
        data.committer = ids[1] ? ids[1]._id : null;

        let commit = new db.Commit(data);
        return new Promise( (resolve, reject) => {
          commit.save( err => {
            if (err) return reject(err);
            resolve(commit);
          });
        });
      });
    });
  }
};

// auto register
locator.register('commit-service', module.exports);
