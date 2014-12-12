/**
 * Created by Pencroff on 11.12.2014.
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('default', function() {
    // place code for your default task here
    console.log('gulp');
});

gulp.task('mocha', function() {
    return gulp.src(['./test/*-test.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }));
        //.on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['plugins/**', 'test/**'], ['mocha']);
});