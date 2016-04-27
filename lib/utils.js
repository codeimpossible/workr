'use strict';

module.exports = {
  mapAsPromised(arr, itt) {
    let promises = arr.map((item) => Promise.resolve(itt(item)));
    return Promise.all(promises);
  },

  filterAsPromised(arr, itt) {
    let promises = arr.filter((item) => Promise.resolve(itt(item)));
    return Promise.all(promises);
  },

  historyAsPromised(commit, until) {
    return new Promise((resolve, reject) => {
      let history = commit.history();
      let commits = [];
      let done = false;
      if (until) {
        history.on('commit', (commit) => {
          if (done) return;
          commits.push(commit);
          if (commit.sha() === until) {
            done = true;
            return resolve(commits);
          }
        });
      } else {
        history.on('end', (commits) => resolve(commits));
      }

      history.on('error', (err) => reject(err));
      history.start();
    });
  }
};
