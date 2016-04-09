'use strict';

/* eslint-env mocha */
// This is required before every test to remove boilerplate includes.

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

// Add sinon assertions to chai
chai.use(sinonChai);

// Add promise helpers to chai
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.sinon = sinon;
