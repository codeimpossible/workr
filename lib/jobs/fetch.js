'use strict';

const joi = require('joi');
const git = require('nodegit');

const Model = require('./../model');
const JobArgs = require('./job-args');

class FetchArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
      branch: joi.string().default('master'),
    });
  }
}

module.exports = class CloneJob {
  constructor(opts) {
    this.opts = new FetchArgs(opts);
  }

  run() {
    let repository;
    return git.Repository
              .open(this.opts.jobArgs.localPath)
              .then((repo) => {
                repository = repo;
                return repo.checkoutBranch(this.opts.branch);
              })
              .then(() => repository.fetch('origin'))
              .then(() => repository.mergeBranches(this.opts.branch, `origin/${this.opts.branch}`))
              .then(() => repository);
  }
}
