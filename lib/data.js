'use strict';

const mongoose = require('mongoose');
const config = require('./config');

const Identity = module.exports.Identity = mongoose.model('Identity', {
  name: String,
  email: String,
  time: Number,
  offset: Number
});

const Commit = module.exports.Commit = mongoose.model('Commit', {
  sha: {type : String, index: { required : true } },
  message: String,
  message_short: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Identity' //Edit: I'd put the schema. Silly me.
  },
  committer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Identity' //Edit: I'd put the schema. Silly me.
  },
  date: Date,
  repoName: {type : String, index: { required : true } },
});

const SlocPack = module.exports.SlocPack = mongoose.model('SlocPack', {
  language: {type : String, index: { required : true } },
  total: Number,
  source: Number,
  comment: Number,
  single: Number,
  block: Number,
  mixed: Number,
  empty: Number
});

const SlocSet = module.exports.SlocSet = mongoose.model('SlocSet', {
  sha: {type : String, index: { required : true } },
  repoName: {type : String, index: { required : true } },
  packs: [SlocPack]
});

const HashSet = module.exports.HashSet = mongoose.model('HashSet', {
  sha: {type : String, index: { required : true } },
  repoName: {type : String, index: { required : true } },
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
