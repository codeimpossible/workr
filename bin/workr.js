#!/usr/env node
'use strict';

const rd = require('require-dir');
const svcs = rd('./../lib/svcs');
// const jobs = rd('./../jobs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pkg = require('./../package.json');
const yargs = require('yargs');

console.log(`Workr v${pkg.version}`);

// short circuit if --service is passed
if (~process.argv.indexOf('--service')) {
  // run service mode
  return;
}

const argv = yargs.usage('$0 <cmd> [args]')
  .command('clone [url]', 'clone a repository locally to the workr temp directory', undefined, (argv) => {
    argv.job = 'clone';
  })
  .command('import [url]', 'imports commits from a cloned reopository', undefined, (argv) => {
    argv.job = 'import';
  })
  .command('sloc [url]', 'counts source lines of code from a cloned reopository', undefined, (argv) => {
    argv.job = 'sloc';
  })
  .help()
  .argv;

const blacklist = ['_', '$0', 'command', 'help', 'job'];
const cleanseArgv = (args) => {
  let n = {};
  Object.keys(args).filter(p => !~blacklist.indexOf(p)).forEach(i => {
    let p = {};
    p[i] = args[i];
    n = Object.assign(p, n);
  });
  return n;
};

const Job = require(path.resolve(root, `./lib/jobs/${argv.job}`));
const JobArgs = require(path.resolve(root, './lib/jobs/job-args'));
const jobArgs = new JobArgs(cleanseArgv(argv));

const action = new Job({ jobArgs });

action.run().then( result => {
  console.log('done!');
  console.log(result);
  process.exit();
})
.catch( err => {
  console.error(err.stack);
});
