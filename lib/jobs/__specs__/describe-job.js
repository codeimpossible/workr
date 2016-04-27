'use strict';

const rimraf = require('rimraf');
const config = require('./../../config');
const JobArgs = require('./../job-args');

module.exports = function testAJob(jobname, cb) {
  beforeEach(function() {
    if (process.env.MOCHAIGNOREJOBS === 'yes') {
      this.skip();
    }
  });

  afterEach(function() {
    return new Promise((resolve) => {
      rimraf(config.tmp, resolve);
    });
  });

  let fixtures = {
    args: new JobArgs({
      url: 'http://github.com/codeimpossible/Artigo.git'
    }),

    getJob: (name, opts) => {
      let Job = require(`./../${name}`);
      opts = opts || { };
      if (!opts.jobArgs) {
        opts.jobArgs = fixtures.args;
      }
      return new Job(opts);
    }
  };

  describe(jobname, function() {
    this.fixtures = fixtures;
    cb.call(this);
  });
};
