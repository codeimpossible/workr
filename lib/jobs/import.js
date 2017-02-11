'use strict';

const joi = require('joi');
const git = require('nodegit');

const Model = require('./../model');
const JobArgs = require('./job-args');

const locator = require('./../service-locator');

class ImportArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
      recentSha: joi.string().optional(),
    });
  }
}

module.exports = class ImportJob {
  constructor(opts) {
    this.opts = new ImportArgs(opts);

    this.commitSvc = locator.resolve('commit-service');
  }

  run() {
    return git.Repository.open(this.opts.jobArgs.localPath)
      .then( repo => repo.getHeadCommit())
      .then( commit => {
        if (this.opts.recentSha && commit.sha() === this.opts.recentSha) {
          return;
        }
        return new Promise( resolve => {
          let commits = [];
          let history = commit.history();
          let done = false;

          history.on('end', () => {
            console.log(commits);
            resolve(commits);
          });
          history.on('commit', (c) => {
            if (done) return;
            if (c.sha() === this.opts.recentSha) {
              done = true;
            }
            commits.push(c);
          });
          history.start();
        });
      })
      .then( commits => {
        let queue = commits.map( commit => {
          console.log(commit.sha());
          return this.commitSvc.insert({
            sha: commit.sha(),
            message: commit.message(),
            author: commit.author(),
            committer: commit.committer(),
            date: commit.date(),
            repoName: this.opts.jobArgs.repoFullName
          });
        });
        return Promise.all(queue);
      });
  }
}
