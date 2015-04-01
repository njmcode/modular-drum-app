/**
 * This configuration taken from
 * https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
 **/

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var hbsfy = require('hbsfy');

hbsfy.configure({
    extensions: ['hbs']
});

function bundle() {
  return bundler.transform(hbsfy)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

var bundler = watchify(browserify(watchify.args));
bundler.add('./src/main.js');
bundler.on('update', bundle);
bundler.on('log', gutil.log);

gulp.task('default', bundle); // run `gulp` to build & watch
