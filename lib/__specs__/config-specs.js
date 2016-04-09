'use strict';

const path = require('path');

describe('configuration object', () => {
  const configjson = require('./../../config.json');
  const config = require('./../config');
  it('should read the config json', () => {
    expect(config).to.have.property('tmp');
  });

  it('should store the temporary path as an absolute', () => {
    expect(path.isAbsolute(config.tmp)).to.be.true;
  });
});
