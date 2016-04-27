'use strict';

module.exports = {
  getJob(name, opts) {
    let Job = require(`./${name}`);
    opts = opts || {};
    return new Job(opts);
  }
}
