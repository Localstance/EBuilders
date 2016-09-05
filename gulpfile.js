var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');
var connect = require('gulp-connect');

gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('build', function () {
  return gulp.src(['./src/scripts/utils/md5.js', './src/scripts/app.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('./build/scripts'))
    .pipe(rename('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/scripts'))
});

gulp.task('eslint', function () {
  return gulp.src(['./src/scripts/*.js'])
    .pipe(eslint({
      'globals': {
        'jQuery': false,
        '$': true
      },
      /*eslint airbnb*/
      configFile: './.eslint.json'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(eslint.results(function (results) {
      console.log('ESlint Results: \n');
      console.log('Total Warnings: ' + results.warningCount);
      console.log('Total Errors: ' + results.errorCount);
      console.log('\nSuccess');
    }));
});

gulp.task('server', ['buildApp'], function(){
  connect.server({
    root: './build',
    port: 8000
  });
});

gulp.task('css', ['sass'], function () {
  return gulp.src('./src/css/*.css')
    .pipe(cssmin({
      showLog: true,
      target: './build/css'
    }))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('buildApp', ['build', 'css']);
gulp.task('default', ['server']);
gulp.task('start', ['server']);