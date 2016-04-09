'use strict';

const path = require('path');
const JobArgs = require('./../job-args');

describe('Job Args', () => {
  let jobArgs = new JobArgs({ url: 'http://github.com/codeimpossible/Artigo.git' });

  it('should require a url', () => {
    expect(() => new JobArgs()).to.throw(/"url" is required/);
  });

  it('should set the repoName from the url', () => {
    expect(jobArgs).to.have.property('repoName', 'Artigo');
  });

  it('should set the repoFullName from the url', () => {
    expect(jobArgs).to.have.property('repoFullName', 'codeimpossible-Artigo');
  });

  it('should set the localPath to a absolute path on disk', () => {
    let tmpPath = path.resolve(__dirname, '../../../tmp', jobArgs.repoFullName);
    expect(jobArgs).to.have.property('localPath');
    expect(jobArgs.localPath).to.equal(tmpPath);
  });
})
