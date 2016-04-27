'use strict';

const hasher = require('./../file-hash');

describe('filehash service', () => {
  let buffer = new Buffer('some contents\r\ntesting!');
  it('should generate a hash', () => {
    let hash = hasher.hash(hasher.modes.RAW, buffer);
    expect(hash).to.equal('a5233f37ee3fbcaf6f8a581a17f893a5');
  });

  it('should generate a hash without newlines', () => {
    let hash = hasher.hash(hasher.modes.NO_NEW_LINES, buffer);
    let comp = hasher.hash(hasher.modes.RAW, 'some contentstesting!');
    expect(hash).to.equal(comp);
  });

  it('should generate a hash without whitespace', () => {
    let hash = hasher.hash(hasher.modes.NO_WHITESPACE, buffer);
    let comp = hasher.hash(hasher.modes.RAW, 'somecontentstesting!');
    expect(hash).to.equal(comp);
  });
});
