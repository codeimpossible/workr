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
        if (this.opts.recentSha && commit.sha() === this.opts.recentSha) {
          return;
        }
        return util.historyAsPromised(commit, this.opts.recentSha);
      }).then((commits) => {
        console.log(`walking ${commits.length} commits...`);
        return util.mapAsPromised(commits, (commit) => {
          return commit.getDiff().then((diffs) => {
            let meta = { commit: commit, files: [] };
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
                      .then((tree) => tree.getEntry(filePath))
                      .then((entry) => !entry.isBlob() ? null : entry.getBlob())
                      .then((blob) => blob && blob.toString())
                      .then((blob) => {
                        if (!blob) return;
                        return {
                          sha: meta.commit.sha(),
                          filePath,
                          repoName: this.opts.jobArgs.repoName,
                          raw: this.hashSvc.hash(this.hashSvc.modes.RAW, blob),
                          nonewline: this.hashSvc.hash(this.hashSvc.modes.NO_NEW_LINES, blob),
                          nowhitespace: this.hashSvc.hash(this.hashSvc.modes.NO_WHITESPACE, blob),
                        };
                      }).catch((e) => console.error(`${meta.commit.sha()}    ${filePath}    ${e.stack}`));
          })
          .then(fileHashes => {
            var promises = fileHashes.filter(hash => !!hash).map(this.hashSvc.insert);
            return Promise.all(promises);
          });
        });
      });
  }
}
