var gulp       = require('gulp');
var plumber    = require('gulp-plumber');
var browserify = require('browserify');
var reactify   = require('reactify');
var source     = require('vinyl-source-stream');

gulp.task('build', function() {
  browserify({
    entries: [ './jsx/application.jsx' ],
    transform: [reactify]
  })
      .bundle()
      .pipe(source('application.js'))
      .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch(['./jsx/**/*.jsx'], ['build']);
});
