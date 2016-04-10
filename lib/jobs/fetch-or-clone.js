'use strict';

const joi = require('joi');
const fs = require('fs');

const Model = require('./../model');
const JobArgs = require('./job-args');
const FetchJob = require('./fetch');
const CloneJob = require('./clone');

class FetchOrCloneArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
      branch: joi.string().default('master'),
    });
  }
}

module.exports = class FetchOrCloneJob {
  constructor(opts) {
    this.opts = new FetchOrCloneArgs(opts);
  }

  run() {
    return new Promise((resolve, reject) {
      fs.exist(this.opts.jobArgs.localPath, (doesExist) => {
        let Job = doesExist ? FetchJob : CloneJob;
        let opts = { jobArgs: this.opts.jobArgs };
        let job = new Job(opts);

        job.run().then(resolve).catch(reject);
      });
    });
  }
}
