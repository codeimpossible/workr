'use strict';

const factory = locator.resolve('job-factory');

describe('fetch job', () => {
  let job = factory.getJob('fetch');

  afterEach(cleanupRepo);

  it('should error if the repository has not been cloned', () => {
    return expect(job.run()).to.eventually.be.rejected;
  });
});
