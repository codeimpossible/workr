'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');

// // Transform all required files with Babel
// require('babel-register');

gulp.task('pre-test', () => {
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

gulp.task('test', ['pre-test'], () => {
  return gulp.src('**/*-specs.js', {
    read: false,
  })
  .pipe(mocha({
    require: ['./specs/setup'],
    // Allow TeamCity to override with custom reporter
    reporter: process.env.MOCHAREPORTER || 'spec',
  }))
  // Creating the reports after tests run
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({
    thresholds: {
      global: 0
    },
  }));
});

// Task for running tests without code coverage; intended only for getting
// more accurate line numbers for debugging test errors
gulp.task('test-debug', () => {
  return gulp.src('**/*-specs.js', {
    read: false,
  })
  .pipe(mocha({
    require: ['./specs/setup'],
    // Allow TeamCity to override with custom reporter
    reporter: process.env.MOCHAREPORTER || 'spec',
  }));
});
