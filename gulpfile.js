/* jslint node: true */
'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var util = require('gulp-util');
var minify_css = require('gulp-minify-css');
var uglify_js = require('gulp-uglify');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var paths = { in : {
        scss: './fe/scss/base.scss',
        js: './fe/js/app.js',
        jade: './fe/jade/*.jade',
    },
    out: {
        scss: './public/css',
        js: './public/js',
        jade: './public',
    }
};


// Get `--debug` flag if it exists and USE IT
var debug = !!util.env.debug;
console.log(debug ? 'Development build in progress...' : 'Production build in progress...');

gulp.task('default', ['templates', 'index', 'style', 'js']);

gulp.task('style', function () {
    return gulp.src(paths.in.scss)
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        }).on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(debug ? util.noop() : minify_css())
        .pipe(gulp.dest(paths.out.scss));
});

gulp.task('js', function () {
    return browserify({
            entries: paths.in.js,
            debug: true,
        })
        .bundle()
        // Output filename. Written in the directory specified by gulp.dest().
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(debug ? util.noop() : uglify_js())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('index', function () {
    return gulp.src(paths.in.jade)
        .pipe(jade())
        .pipe(gulp.dest(paths.out.jade));
});

gulp.task('templates', function () {
    return gulp.src('./fe/jade/templates/*.jade')
        .pipe(jade({}))
        .pipe(gulp.dest(paths.out.jade + '/templates'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('./fe/scss/*.scss', ['style']);
    gulp.watch('./fe/js/*.js', ['js']);
    gulp.watch('./fe/jade/*.jade', ['index']);
    gulp.watch('./fe/jade/templates/*.jade', ['templates']);
});