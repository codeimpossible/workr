'use strict';

const ImportJob = require('./../import');
const JobArgs = require('./../job-args');
const config = require('./../../config');
const locator = require('./../../service-locator');

const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

describe('Import Job', () => {
  let args = new JobArgs({
    url: 'http://github.com/codeimpossible/Artigo.git'
  });
  let svc = { insert: sinon.spy() };
  locator.inject('commit-service', svc);
  let job = new ImportJob({ jobArgs: args });

  describe('integrations', () => {
    const CloneJob = require('./../clone');
    const clone = new CloneJob({ jobArgs: args });

    beforeEach(function() {
      this.timeout(60 * 1000);
      svc.insert.reset();
      return clone.run();
    });

    afterEach(() => {
      return new Promise((resolve) => {
        rimraf(config.tmp, resolve);
      });
    });

    it('should inport the commits', () => {
      return job.run().then(function(commits) {
        expect(svc.insert).to.have.callCount(195);
        expect(commits.length).to.equal(195);
        for (var i = 0; i < commits.length; i++) {
          let first = svc.insert.getCall(i);
          let commit = first.args[0];

          expect(commit).to.have.property('sha');
          expect(commit).to.have.property('message');
          expect(commit).to.have.property('author');
          expect(commit).to.have.property('committer');
          expect(commit).to.have.property('date');
          expect(commit).to.have.property('repoName');
        }
      });
    }).timeout(30 * 1000);
  });
});
