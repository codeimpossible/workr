'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./config');

const Job = module.exports.Job = mongoose.model('Job', {
  workr: {
    type: Schema.Types.ObjectId,
    ref: 'WorkrClient'
  },
  type: String,
  args: Object,
  status: String
});

const WorkrClient = module.exports.WorkrClient = mongoose.model('WorkrClient', {
  clientId: { type: String, index: { required: true } },
  hostname: String,
  os: String,
  stats: Object
});

const Identity = module.exports.Identity = mongoose.model('Identity', {
  name: String,
  email: String
});

const Commit = module.exports.Commit = mongoose.model('Commit', {
  sha: {type : String, index: { required : true } },
  message: String,
  message_short: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Identity'
  },
  committer: {
    type: Schema.Types.ObjectId,
    ref: 'Identity'
  },
  date: Date,
  repoName: {type : String, index: { required : true } },
});

const SlocSet = module.exports.SlocSet = mongoose.model('SlocSet', {
  sha: {type : String, index: { required : true } },
  repoName: {type : String, index: { required : true } },
  packs: Object
});

const FileHash = module.exports.HashSet = mongoose.model('HashSet', {
  sha: {type : String, index: { required : true } },
  repoName: {type : String, index: { required : true } },
  filePath: String,
  raw: String,
  nonewlines: String,
  nowhitespace: String
});

let hasConnected = false;
const connect =  module.exports.connect = () => {
  return new Promise( (resolve, reject) => {
    try {
      if (!hasConnected) {
        mongoose.connect(config.mongo);
        hasConnected = true;
      }
      resolve(mongoose.connection);
    } catch (e) {
      return reject(e);
    }
  });
};
