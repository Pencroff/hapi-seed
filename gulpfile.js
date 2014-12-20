/**
 * Created by Pencroff on 11.12.2014.
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var istanbul = require('gulp-istanbul');
var clean = require('gulp-clean');

gulp.task('default', ['watch-mocha']);

gulp.task('mocha', function() {
    return gulp.src(['./test/*-test.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }));
        //.on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['common/**', 'test/**'], ['mocha']);
});

gulp.task('clear-coverage', function() {
    return gulp.src(['./coverage'], {read: false})
        .pipe(clean());
});

gulp.task('cover', ['clear-coverage'], function (cb) {
    gulp.src(['common/*.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(['./test/*-test.js'])
                .pipe(mocha())
                .pipe(istanbul.writeReports({reporters: [ 'lcov', 'text', 'text-summary', 'clover' ]})) // Creating the reports after tests runned
                .on('end', cb)
                .on('error', gutil.log);
        });
});
