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
    let fetch = git.Repository.open(this.opts.jobArgs.localPath);

    if (this.opts.branch !== 'master') {
      return fetch.then((repo) => {
        repository = repo;
        return repo.fetchAll();
      })
      .then(() => repository.getBranchCommit(this.opts.branch))
      .then((commit) => git.Branch.create(repository, this.opts.branch, commit, true))
      .then(() => repository.checkoutBranch(this.opts.branch))
      .then(() => repository); // ensure we return the repo
    }

    return fetch;
  }
}
