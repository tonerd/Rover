const browserify = require("browserify");
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat');
const gulp = require('gulp');
const minifyCSS = require('gulp-csso');
const rename = require('gulp-rename')
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

gulp.task('copy_css', function() {
  return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/bootstrap/dist/css/bootstrap.min.css.map'])
    .pipe(gulp.dest('public/build/css'));
});

gulp.task('css', function() {
  return gulp.src('public/styles/*.scss')
    .pipe(concat('styles.min.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/build/css'))
});

gulp.task('js', function() {
  const bundler = browserify('public/app.js').transform('babelify', { presets: ['es2015', 'react'] });

  return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/js'))
});

gulp.task('default', [ 'css', 'js', 'copy_css' ]);
