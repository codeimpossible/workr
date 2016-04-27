'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');

let testOptions = {
  mochaOpts: {
    require: ['./specs/setup'],
    timeout: 60000,
    // Allow TeamCity to override with custom reporter
    reporter: process.env.MOCHAREPORTER || 'spec',
  },
  istanbulOpts: {
    thresholds: {
      global: 0
    },
  },
  subtasks: {
    integration: {
      glob: '**/*-integrations.js',
    },
    func: {
      glob: '**/*-specs.js',
    }
  }
};

gulp.task('test:warmup', () => {
  return gulp.src([
      'lib/**/*.js',
      '!**/__specs__/**/*.js'
    ])
    // Covering files
    .pipe(istanbul({
      // Include files that don't have tests yet
      includeUntested: true,
      instrumenter: isparta.Instrumenter // Use the isparta instrumenter (code coverage for ES6)
      // Istanbul configuration (see https://github.com/SBoudrias/gulp-istanbul#istanbulopt)
      // ...
    }))
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

for(let task in testOptions.subtasks) {
  let def = testOptions.subtasks[task];
  gulp.task(`test:${task}`, ['test:warmup'], () => {
    return gulp.src(def.glob, { read: false })
               .pipe(mocha(testOptions.mochaOpts))
               .pipe(istanbul.writeReports())
               .pipe(istanbul.enforceThresholds(testOptions.istanbulOpts));
  });

  gulp.task(`test:${task}:debug`, () => {
    return gulp.src(def.glob, { read: false })
               .pipe(mocha(testOptions.mochaOpts))
  });
}
