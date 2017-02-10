var fs = require('fs'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  image = require('gulp-image'),
  cheerio = require('gulp-cheerio'),
  path = require('path'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  postcss = require('gulp-postcss'),
  notify = require("gulp-notify"),
  flexibility = require('postcss-flexibility');

var src = {
  root: 'src',
  jade: 'src/jade/pages/**/*.jade',
  sass: 'src/sass/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  data: 'src/data/*.json',
  fonts: 'src/fonts/*',
  icons: 'src/senat_icons/fonts/*'
};

var dest = {
  root: 'dist',
  css: 'dist/css/',
  js: 'dist/js',
  img: 'dist/img/',
  data: 'dist/data/',
  fonts: 'dist/fonts'
};

gulp.task('jade', function () {
  gulp.src(src.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      locals: {
        'nav': JSON.parse(fs.readFileSync('src/jade/components/nav/data.json', {encoding: 'utf-8'}))
      }
    }).on('error', gutil.log))
    .pipe(gulp.dest(dest.root))
    .pipe(notify("templates done"))
  // .pipe(reload({stream: true}))
  ;
});

gulp.task('js', function () {
  gulp.src(src.js)
    .pipe(plumber())
    .pipe(gulp.dest(dest.js))
    .pipe(notify("js done"))
  // .pipe(reload({stream: true}))
  ;
});

gulp.task('sass', function () {
  gulp.src(src.sass)
  // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'ie9'))
    .pipe(postcss([flexibility]))
    // .pipe(rename('style.css'))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest.css))
    .pipe(notify("styles done"))
  // .pipe(reload({stream:true}))
  ;
});

gulp.task('csso', function () {
  return gulp.src(dest.css + 'style.css')
    .pipe(csso())
    .pipe(gulp.dest(dest.css));
});

gulp.task('copy', function () {
  gulp.src([src.img, '!src/img/icons/sprite/*.svg'])
    .pipe(gulp.dest(dest.img));
  gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
  gulp.src(src.icons)
    .pipe(gulp.dest(dest.fonts));
  gulp.src(src.data)
    .pipe(gulp.dest(dest.data));
});

gulp.task('image', function () {
  gulp.src(src.img)
    .pipe(image())
    .pipe(gulp.dest(dest.img));
});

gulp.task('svgstore', function () {
  return gulp.src('src/img/icons/sprite/*.svg')
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[style]').removeAttr('style');
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
      },
      parserOptions: {xmlMode: true}
    }))
    .pipe(svgstore())
    .pipe(gulp.dest('dist/img/icons/sprite/'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: dest.root,
    port: 62200,
    ui: {
      port: 62201
    }
  });
});

gulp.task('dev', ['sass', 'js', 'copy', 'jade', 'browser-sync'], function () {
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.fonts, ['copy']);
  gulp.watch(src.icons, ['copy']);
  gulp.watch(src.img, ['copy']);
});

gulp.task('default', ['dev']);
gulp.task('build', ['csso', 'image']);
gulp.task('svg', ['svgstore']);
