
require('./../lib/ioc');

const JobArgs = require('./../lib/jobs/job-args');
const locator = require('./../lib/service-locator');
const factory = locator.resolve('job-factory');
const args = new JobArgs({ url: 'https://github.com/codeimpossible/Artigo.git' });
const clone = factory.getJob('clone', { jobArgs: args });
const hash = factory.getJob('hash', { jobArgs: args });

clone.run()
  .then(() => hash.run())
  .then((data) => {
    let commits = data.length;
    let files = data.map(c => c.length).reduce((p, c, idx, arr) => p + c);
    console.log(`\nhashed ${files} files in ${commits} commits.`);
  })
  .catch((e) => console.error(e.stack));
