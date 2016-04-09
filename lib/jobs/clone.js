'use strict';

const joi = require('joi');
const git = require('nodegit');

const Model = require('./../model');
const JobArgs = require('./job-args');

class CloneArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
      username: joi.string().optional(),
      bare: joi.boolean().default(false),
      branch: joi.string().default('master'),
    });
  }
}

module.exports = class CloneJob {
  constructor(opts) {
    this.opts = new CloneArgs(opts);
  }

  run() {
    return git.Clone(this.opts.jobArgs.url, this.opts.jobArgs.localPath)
            .catch(() => git.Repository.open(this.opts.jobArgs.localPath));
  }
}
