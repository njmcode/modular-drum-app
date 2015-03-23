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

var bundler = watchify(browserify(watchify.args));
bundler.add('./src/main.js');

gulp.task('build', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler
bundler.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return bundler.transform(hbsfy)
    .bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    // optional, remove if you dont want sourcemaps
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
	.pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}