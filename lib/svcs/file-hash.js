'use strict';

const crypto = require('crypto');
const locator = require('./../service-locator');

module.exports = {
  get modes() {
    return {
      RAW: 0,
      NO_NEW_LINES: 1,
      NO_WHITESPACE: 2,
    }
  },

  hash(mode, file) {
    let md5 = crypto.createHash('md5');
    file = file instanceof Buffer ? file.toString() : file;
    if (mode === this.modes.NO_NEW_LINES) {
      file = file.replace(/[\r\n]/g, '');
    }
    if (mode === this.modes.NO_WHITESPACE) {
      file = file.replace(/\s/g, '');
    }
    return md5.update(file).digest('hex');
  }
};

// auto register
locator.register('filehash-service', module.exports);
