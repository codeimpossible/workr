'use strict';

const mongoose = require('mongoose');

module.exports.Commit = mongoose.model('Commit', {
  sha: String,
  message: String,
  message_short: String,
  author: Object,
  committer: Object,
  date: Date,
  repoName: {type : String, index: { required : true } },
});
