'use strict';

const gulp = require('gulp');
const tasks = require('require-dir')('./tasks');

gulp.task('build', ['lint']);

gulp.task('default', ['build', 'test']);

gulp.task('travis', ['build', 'test']);
