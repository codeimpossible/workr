'use strict';

const joi = require('joi');
const git = require('nodegit');
const sloc = require('sloc');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const async = require('async');

const Model = require('./../model');
const JobArgs = require('./job-args');
const locator = require('./../service-locator');

class SlocArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
    });
  }
}

let stats = { };
let addStats = (ext, s) => {
  stats[ext] = stats[ext] || {
    total: 0, source: 0, comment: 0, single: 0, block: 0, mixed: 0, empty: 0
  };
  stats[ext].total += s.total;
  stats[ext].source += s.source;
  stats[ext].comment += s.comment;
  stats[ext].single += s.single;
  stats[ext].block += s.block;
  stats[ext].mixed += s.mixed;
  stats[ext].empty += s.empty;
};

module.exports = class CloneJob {
  constructor(opts) {
    this.opts = new SlocArgs(opts);

    this.slocSvc = locator.resolve('slocset-service');
  }

  run() {
    return new Promise((resolve, reject) => {
      readdirp({
        root: this.opts.jobArgs.localPath,
        fileFilter: ['*.js'],
      }, (err, res) => {
        if (err) {
          return reject(err);
        }

        async.each(res.files, (f, cb) => {
          const fullpath = path.join(this.opts.jobArgs.localPath, f.path);
          fs.readFile(fullpath, (e, data) => {
            if (e) {
              return cb(e);
            }
            let code = data.toString();
            let ext = path.extname(f.path).replace('.','');
            let stats = sloc(code, ext);
            addStats(ext, stats);
            cb();
          });
        }, (e) => {
          if (e) {
            return reject(e);
          }
          let packs = Object.keys(stats).map((lang) => {
            language: lang,
            stats[lang].total,
            stats[lang].source,
            stats[lang].comment,
            stats[lang].single,
            stats[lang].block,
            stats[lang].mixed,
            stats[lang].empty
          });
          this.slocSvc.insert({
            repoName: this.opts.jobArgs.repoFullName,
            sha: '',
            packs,
          }).then(() => resolve(stats));
        });
      });
    });
  }
}
