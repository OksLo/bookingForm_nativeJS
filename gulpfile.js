let gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug');

gulp.task('sass', () => {
  return gulp.src('app/css/scss/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});

gulp.task('html', () => {
  return gulp.src('app/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('css', () => {
  return gulp.src('app/css/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('js', () => {
  return gulp.src('app/js/*.js')
    .pipe(gulp.dest('dist/js'))
});

gulp.task('data', () => {
  return gulp.src('app/js/data/*.json')
    .pipe(gulp.dest('dist/js/data'))
});

gulp.task('default', [ 'html', 'css', 'js', 'data' ]);