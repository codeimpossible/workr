'use strict';

'use strict';

const joi = require('joi');
const git = require('nodegit');

const Model = require('./../model');
const JobArgs = require('./job-args');

const locator = require('./../service-locator');
const util = require('./../utils');

class HashArgs extends Model {
  get schema() {
    return joi.object().keys({
      jobArgs: joi.object().type(JobArgs),
      recentSha: joi.string().optional()
    });
  }
}

module.exports = class HashJob {
  constructor(opts) {
    this.opts = new HashArgs(opts);

    this.hashSvc = locator.resolve('filehash-service');
  }

  run() {
    return git.Repository.open(this.opts.jobArgs.localPath)
      .then((repo) => repo.getHeadCommit())
      .then((commit) => {
        console.log(`HEAD is ${commit.sha()}`);
        if (this.opts.recentSha && commit.sha() === this.opts.recentSha) {
          return;
        }
        return util.historyAsPromised(commit, this.opts.recentSha);
      }).then((commits) => {
        console.log(`walking ${commits.length} commits...`);
        return util.mapAsPromised(commits, (commit) => {
          process.stdout.write('.');
          return commit.getDiff().then((diffs) => {
            let meta = {
              commit: commit,
              files: []
            };
            diffs.forEach((d) => {
              let deltas = d.numDeltas();
              let idx = 0;
              while(idx++ < deltas) {
                if (d.getDelta(idx)) {
                  var file = d.getDelta(idx).newFile();
                  // IGNORE DELETED FILES
                  if (file.flags() !== 4)
                    meta.files.push(file.path());
                }
              }
            });
            return meta;
          });
        });
      }).then((commitsWithFiles) => {
        return util.mapAsPromised(commitsWithFiles, (meta) => {
          meta.hashes = {};
          return util.mapAsPromised(meta.files, (filePath) => {
            return meta.commit.getTree()
                      .then((tree) => {
                        console.log(filePath);
                        return tree.getEntry(filePath)
                      })
                      // .then((entry) => entry.isBlob() ? entry.getBlob() : undefined)
                      .then((entry) => {
                        if (!entry.isBlob()) {
                          console.log(`${entry.path()} is not a file`);
                          return null;
                        }
                        return entry.getBlob();
                      })
                      .then((blob) => blob && blob.toString())
                      .then((blob) => {
                        if (!blob) return;
                        console.log(filePath, 2);
                        return {
                          sha: meta.commit.sha(),
                          filePath,
                          repoName: this.opts.jobArgs.repoName,
                          raw: this.hashSvc.hash(this.hashSvc.modes.RAW, blob),
                          nonewline: this.hashSvc.hash(this.hashSvc.modes.NO_NEW_LINES, blob),
                          nowhitespace: this.hashSvc.hash(this.hashSvc.modes.NO_WHITESPACE, blob),
                        };
                      }).catch((e) => {
                        return {
                          sha: meta.commit.sha(),
                          fileLocation: filePath,
                          err: e
                        };
                      });
          });
        });
      });
  }
}
