'use strict';

const CloneJob = require('./../clone');
const JobArgs = require('./../job-args');
const path = require('path');
const fs = require('fs');

describe('clone job', () => {
  let args = new JobArgs({
    url: 'http://github.com/codeimpossible/Artigo.git'
  });
  let job = new CloneJob({ jobArgs: args });

  afterEach(cleanupRepo);

  it('should clone the repository', () => {
    return job.run().then(function(repo) {
      return new Promise((resolve) => {
        fs.exists(path.resolve(job.opts.jobArgs.localPath, '.git/'), (doesExist) => {
          expect(doesExist).to.be.true;
          resolve();
        });
      });
    });
  });
});
