'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
// const config = require('./config').lint;

gulp.task('lint', function() {
  // This glob doesn't need configured because we're just pulling all local JS
  // files and letting eslint handle any necessary ignores

  return gulp.src(['**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format(process.env.ESLINTFORMATTER || null))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});
