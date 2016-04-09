'use strict';

const joi = require('joi');
const path = require('path');
const configSource = require('./../config.json');
const schema = joi.object().keys({
  tmp: joi.string().required()
});

let result = joi.validate(configSource, schema);
if (result.error) {
  console.error('workr ERR! config doesnt match schema:');
  console.error(result.error.stack);
  throw result.error;
}

function transform(config) {
  config.tmp = path.resolve(__dirname, '../', config.tmp);
  return config;
}

module.exports = transform(result.value);
