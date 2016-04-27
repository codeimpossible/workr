'use strict';

const locator = require('./../lib/service-locator');
const fixtures = require('./fixtures');

locator.inject('job-factory', {
  getJob(name, opts) {
    let Job = require(`./../lib/jobs/${name}`);
    opts = opts || { };
    if (!opts.jobArgs) {
      opts.jobArgs = fixtures.args;
    }
    return new Job(opts);
  }
});
