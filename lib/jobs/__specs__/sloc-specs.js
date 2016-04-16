'use strict';

const SlocJob = require('./../sloc');
const CloneJob = require('./../clone');
const JobArgs = require('./../job-args');
const config = require('./../../config');
const locator = require('./../../service-locator');

const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

describe('sloc job', () => {
  let args = new JobArgs({
    url: 'http://github.com/codeimpossible/Artigo.git'
  });

  let svc = { insert: sinon.stub().returns(Promise.resolve()) };
  locator.inject('slocset-service', svc);

  let clone = new CloneJob({ jobArgs: args });
  let job = new SlocJob({ jobArgs: args });

  describe('integrations', () => {
    before(function() {
      this.timeout(60 * 1000);
      return clone.run();
    });

    afterEach(() => {
      return new Promise((resolve) => {
        rimraf(config.tmp, resolve);
      });
    });

    it('should resolve with the stats', () => {
      return job.run().then((stats) => {
        expect(stats).not.to.be.undefined;
        expect(stats).to.have.property('js');
        expect(stats.js).to.have.property('total', 9039);
        expect(stats.js).to.have.property('source', 5873);
        expect(stats.js).to.have.property('comment', 2103);
        expect(stats.js).to.have.property('single', 1096);
        expect(stats.js).to.have.property('block', 1007);
        expect(stats.js).to.have.property('mixed', 208);
        expect(stats.js).to.have.property('empty', 1277);
      });
    });
  });
});
