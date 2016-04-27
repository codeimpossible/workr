'use strict';

const JobArgs = require('./../lib/jobs/job-args');

module.exports = {
  args: new JobArgs({
    url: 'http://github.com/codeimpossible/Artigo.git'
  })
};
