'use strict';

/* eslint-env mocha */
// This is required before every test to remove boilerplate includes.
const rimraf = require('rimraf');
const config = require('./../lib/config');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mocha = require('mocha');
const mkdirp = require('mkdirp');
const path = require('path');

// Add sinon assertions to chai
chai.use(sinonChai);

// Add promise helpers to chai
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.sinon = sinon;
global.fixtures = require('./fixtures');
global.locator = require('./../lib/service-locator');

global.cleanupRepo = () => new Promise((resolve) => rimraf(config.tmp, resolve));
global.ensureTempDirectory = () => {
  return new Promise((resolve, reject) => {
    mkdirp(path.resolve(__dirname, '../tmp'), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// include our inversion of control setups
require('./ioc');
