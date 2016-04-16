'use strict';

const mongoose = require('mongoose');

const Commit = module.exports.Commit = mongoose.model('Commit', {
  sha: String,
  message: String,
  message_short: String,
  author: Object,
  committer: Object,
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
