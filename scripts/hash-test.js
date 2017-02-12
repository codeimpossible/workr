var git = require('nodegit');
var path = require('path');
var fs = require('fs');

var _ = require('./../lib/utils');

var repoPath = path.resolve(__dirname, './../tmp/codeimpossible-Artigo');
git.Repository.open(repoPath)
  .then(repo => repo.getHeadCommit())
  .then(head => {
    console.log(`head is ${head.sha()}`);
    return _.historyAsPromised(head);
  })
  .then(commits => {
    console.log(`${commits.length} commits`);
    return new Promise( (resolve, reject) => {
      var diffs = commits.filter(c => c.sha() === 'e970bb79fb774c57cb259fca836a1e209a879ab6').map(c => c.getDiff());
      Promise.all(diffs).then(resolve);
    });
  })
  .then(diffs => {
    diffs.forEach(diff => {
      diff.filter(d => d.numDeltas() > 0).forEach(d => {
        for (var idx = 0, len = d.numDeltas(); idx < len; idx++) {
          var delta = d.getDelta(idx);
          var file = delta.newFile();
          console.log(file.path(), file.flags(), file.mode(), file.size());
        }
      })
    })
  })
  .catch(e => console.error(e.stack));
