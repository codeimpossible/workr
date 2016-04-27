'use strict';

const git = require('nodegit');
const fs = require('fs');

const factory = locator.resolve('job-factory');

describe('fetch job', () => {
  let job = factory.getJob('fetch');
  const clone = factory.getJob('clone');

  beforeEach(() => clone.run());
  afterEach(cleanupRepo);

  it('should fetch the latest code', () => {
    let sha = git.Oid.fromString('7302289fa60ee75a8f61eceef660624ad2cc2008');
    return job.run().then((repo) => repo.getHeadCommit())
                    .then((ref) => {
                      return expect(ref.id().equal(sha)).to.equal(1);
                    });
  });

  it('should checkout to the specified branch', () => {
    let newBranch = factory.getJob('fetch', { branch: 'origin/gh-pages' });
    return newBranch.run().then((repo) => repo.getCurrentBranch())
                          .then((branch) => {
                            return expect(branch.name()).to.equal('refs/heads/origin/gh-pages');
                          });
  });
});
