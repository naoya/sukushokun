var gulp = require('gulp');
var react = require('gulp-react');
var plumber = require('gulp-plumber');

gulp.task('react', function () {
  return gulp.src('./jsx/**/*.jsx')
      .pipe(plumber())
      .pipe(react())
      .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function () {
  gulp.watch(['./jsx/**/*.jsx'], ['react']);
});
