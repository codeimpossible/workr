'use strict';

const joi = require('joi');
const Model = require('./../model');

class Test extends Model {
  transform(d) {
    d.something = 10;
    return d;
  }
}

class WithSchema extends Test {
  get schema() {
    return joi.object().keys({
      test: joi.string().required(),
      something: joi.number().required().valid(10),
    })
  }
}

describe('model', () => {
  it('should assign object passed to itself', () => {
    let model = new Model({ test: 'value' });
    expect(model).to.have.property('test', 'value');
  });

  it('should allow data to be transformed', () => {
    let model = new Test({ test: 'value' });
    expect(model).to.have.property('test', 'value');
    expect(model).to.have.property('something', 10);
  });

  it('should validate data against a schema', () => {
    let model = new WithSchema({ test: 'value' });
    expect(model).to.have.property('test', 'value');
    expect(model).to.have.property('something', 10);
  });
});
