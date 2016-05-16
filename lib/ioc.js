const locator = require('./service-locator');
const requireDir = require('require-dir');

requireDir('./../lib/svcs');

locator.register('job-factory', {
  getJob(name, opts) {
    let Job = require(`./jobs/${name}`);
    opts = opts || { };
    return new Job(opts);
  }
});
