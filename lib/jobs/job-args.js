'use strict';

const joi = require('joi');
const path = require('path');
const url = require('url');

const Model = require('./../model');
const config = require('./../config');

module.exports = class JobArgs extends Model {
  get schema() {
    return joi.object().keys({
      url: joi.string().uri().required(),
      repoName: joi.string().optional(),
      repoFullName: joi.string().optional(),
      localPath: joi.string().required(),
    });
  }

  transform(data) {
    data.repoName = data.repoName || path.parse(data.url || '').name;
    data.repoFullName = url.parse(data.url || '').path || '';
    data.repoFullName = data.repoFullName.replace('.git', '')
                                          .replace(/^\//i, '')
                                          .replace(/\//ig, '-');
    data.localPath = path.resolve(config.tmp, data.repoFullName);
    return data;
  }
};
