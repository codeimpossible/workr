'use strict';

const FetchJob = require('./../fetch');
const JobArgs = require('./../job-args');
const config = require('./../../config');
const git = require('nodegit');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

describe('fetch job', () => {
  let args = new JobArgs({
    url: 'http://github.com/codeimpossible/Artigo.git'
  });
  let job = new FetchJob({ jobArgs: args });

  it('should error if the repository has not been cloned', () => {
    return expect(job.run()).to.eventually.be.rejected;
  });

  describe('integrations', () => {
    const CloneJob = require('./../clone');
    const clone = new CloneJob({ jobArgs: args });

    beforeEach(function() {
      this.timeout(30 * 1000);
      return clone.run();
    });

    afterEach(() => {
      return new Promise((resolve) => {
        rimraf(config.tmp, resolve);
      });
    });

    it('should fetch the latest code', () => {
      let sha = git.Oid.fromString('7302289fa60ee75a8f61eceef660624ad2cc2008');
      return job.run().then((repo) => repo.getHeadCommit())
                      .then((ref) => {
                        return expect(ref.id().equal(sha)).to.equal(1);
                      });
    }).timeout(30 * 1000);

    it('should checkout to the specified branch', () => {
      let newBranch = new FetchJob({ jobArgs: args, branch: 'origin/gh-pages' });
      return newBranch.run().then((repo) => repo.getCurrentBranch())
                            .then((branch) => {
                              return expect(branch.name()).to.equal('refs/heads/origin/gh-pages');
                            });
    }).timeout(30 * 1000);
  });
});
