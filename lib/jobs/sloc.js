'use strict';

const joi = require('joi');
const git = require('nodegit');
const sloc = require('sloc');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const async = require('async');
const slash = require('slash');

const Model = require('./../model');
const JobArgs = require('./job-args');
const locator = require('./../service-locator');

const ignoreDirectories = [
  'node_modules',
  '.git',
  'vendor'
];

class SlocArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
    });
  }
}

let commit = {};
let stats = {};
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
    return git.Repository.open(this.opts.jobArgs.localPath)
      .then( repo => repo.getHeadCommit())
      .then( head => {
        commit = head;
        return this.slocSvc.slocExists(head);
      })
      .then( existingSlocSet => {
        if (existingSlocSet) return Promise.resolve(existingSlocSet);
        let files = [];
        return new Promise( (resolve, reject) => {
          readdirp({
            root: this.opts.jobArgs.localPath,
            fileFilter: sloc.extensions.map(ext => `*.${ext}`),
            directoryFilter: ignoreDirectories.map(dir => `!${dir}`)
          })
          .on('end', () => resolve(files))
          .on('error', err => reject(err))
          .on('data', entry => files.push(entry.fullPath));
        })
        .then( files => {
          return Promise.all(files.map(file => {
            return new Promise( (resolve, reject) => {
              fs.readFile(file, (err, data) => {
                if (err) return reject(err);
                let code = data.toString();
                let ext = path.extname(file).replace('.','');
                let stats = sloc(code, ext);

                addStats(ext, stats);
                resolve();
              });
            });
          }));
        })
        .then( () => {
          return Object.keys(stats).map((lang) => {
            return {
              language: lang,
              total: stats[lang].total,
              source: stats[lang].source,
              comment: stats[lang].comment,
              single: stats[lang].single,
              block: stats[lang].block,
              mixed: stats[lang].mixed,
              empty: stats[lang].empty
            };
          });
        })
        .then( packs => {
          return this.slocSvc.insert({
            repoName: this.opts.jobArgs.repoFullName,
            sha: commit.sha(),
            packs,
          });
        });
      });
  }
}
