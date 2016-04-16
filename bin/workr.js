#!/usr/env node

const rd = require('require-dir');
const svcs = rd('./../svcs');
const jobs = rd('./../jobs');
const package = require('./../package.json');

const out = process.stdout;

out(`Workr v${package.version}`);
