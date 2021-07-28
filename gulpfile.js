'use strict';

// Plugin
const gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileInclude = require('gulp-file-include'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  del = require('del'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  imageMin = require('gulp-imagemin'),
  changed = require('gulp-changed'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano');

// Folder
const root = './webapp/',
  src = root + 'src/',
  dist = root + 'dist/';

const dir = {
  src: {
    html: src + 'html/',
    sass: src + 'sass/',
    js: src + 'js/',
    images: src + 'images/',
    bundle: src + 'bundle/'
  },
  dist: {
    html: dist + 'html/',
    css: dist + 'css/',
    js: dist + 'js/',
    images: dist + 'images/',
    library: dist + 'library/',
	bundle: dist + 'bundle/'
  }
};

/**
 * =======================================================+
 * @task : File Include
 * =======================================================+
 */
gulp.task('fileInclude', () => {
  return new Promise(resolve => {
    gulp
      .src([dir.src.html + '**/*.html', '!' + dir.src.html + 'include/*.html'])
      .pipe(
        fileInclude({
          prefix: '@@',
          basepath: '@file'
        })
      )
      .pipe(gulp.dest(dir.dist.html))
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Sass Options
 * =======================================================+
 */

const sassOptions = {
  /**
   * outputStyle (Type : String , Default : nested)
   * CSS의 컴파일 결과 코드스타일 지정 * Values : nested, expanded, compact, compressed
   */
  outputStyle: 'compact',
  /**
   * indentType (>= v3.0.0 , Type : String , Default : space)
   * 컴파일 된 CSS의 "들여쓰기" 의 타입 * Values : space , tab
   */
  indentType: 'space',
  /**
   * indentWidth (>= v3.0.0, Type : Integer , Default : 2)
   * 컴파일 된 CSS의 "들여쓰기" 의 갯수
   */
  indentWidth: 1, // outputStyle 이 nested, expanded 인 경우에 사용
  /**
   * precision (Type : Integer , Default : 5)
   * 컴파일 된 CSS 의 소수점 자리수.
   */
  precision: 6,
  /**
   * sourceComments (Type : Boolean , Default : false)
   * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
   */
  sourceComments: false
};

/**
 * =======================================================+
 * @task : Sass Build & autoprefixer & Sass Sourcemaps
 * =======================================================+
 */
gulp.task('sass', () => {
  return new Promise(resolve => {
    gulp
      .src([
		  dir.src.sass + '*.sass',
		  dir.src.sass + '*.scss'
		], {
        sourcemaps: true
      })
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(
        gulp.dest(dir.dist.css, {
          sourcemaps: './maps'
        })
      )
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Sass .min file Build & autoprefixer & Sass .min file Sourcemaps
 * =======================================================+
 */
gulp.task('sassMin', () => {
  return new Promise(resolve => {
    gulp
      .src([
		  dir.src.sass + '*.sass',
		  dir.src.sass + '*.scss'
	  ], {
        sourcemaps: true
      })
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(cssnano())
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(
        gulp.dest(dir.dist.css, {
          sourcemaps: './maps'
        })
      )
	  .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : babel & Sourcemaps
 * =======================================================+
 */
gulp.task('babel', () => {
  return new Promise(resolve => {
    gulp
      .src(dir.src.js + '**/*.js', {
        sourcemaps: true
      })
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(
        gulp.dest(dir.dist.js, {
          sourcemaps: './maps'
        })
      )
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : babel & uglify & Sourcemaps
 * =======================================================+
 */
gulp.task('babelMin', () => {
  return new Promise(resolve => {
    gulp
      .src(dir.src.js + '**/*.js', {
        sourcemaps: true
      })
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(
        uglify({
          mangle: {
            toplevel: true
          },
          output: {
            beautify: false,
            comments: false
          }
        })
      )
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(
        gulp.dest(dir.dist.js, {
          sourcemaps: './maps'
        })
      );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : image min
 * =======================================================+
 */
gulp.task('imgMin', () => {
  return new Promise(resolve => {
    gulp
      .src([
        dir.src.images + '**/*.jpg',
        dir.src.images + '**/*.gif',
        dir.src.images + '**/*.png'
      ])
      .pipe(changed(dir.dist.images))
      .pipe(imageMin())
      .pipe(gulp.dest(dir.dist.images))
	  /*
      .pipe(
        browsersync.reload({
          // 실시간 reload
          stream: true
        })
      );
	  */
    resolve();
  });
});

/**
 * =======================================================+
 * @task : DIST Folder Clean
 * =======================================================+
 */
gulp.task('clean', () => {
  return new Promise(resolve => {
    del.sync(
      [
        dir.dist.html,
        dir.dist.css,
        dir.dist.js,
        dir.dist.images,
		dir.dist.library,
		dir.dist.bundle
      ],
      {
        force: true
      }
    );
    resolve();
  });
});

/**
 * =======================================================+
 * @task : Was
 * =======================================================+
 */
gulp.task('browserSync', () => {
  return new Promise(resolve => {
    browsersync.init({
      server: {
        baseDir: dist
      },
      port: 80
    });
    resolve();
  });
});

gulp.task('fileMove', () => {
  return new Promise(resolve => {
    gulp.src([src + 'index.html']).pipe(gulp.dest(dist));
    resolve();
  });
});

gulp.task('bundleFileMove', ()=> {
  return gulp
    .src(dir.src.bundle + '**/*')
    .pipe(gulp.dest(dir.dist.bundle))
  });
  
/**
 * =======================================================+
 * @task : watch
 * =======================================================+
 */
gulp.task('watch', () => {
  return new Promise(resolve => {
    gulp.watch(dir.src.html + '**/*.html', gulp.series('fileInclude'));
    gulp.watch([
		dir.src.sass + '**/*.sass',
		dir.src.sass + '**/*.scss'
	], gulp.series(['sass', 'sassMin']));
    gulp.watch(dir.src.js + '**/*.js', gulp.series(['babel', 'babelMin']));
    gulp.watch(dir.src.images, gulp.series('imgMin'));
    gulp.watch(src + 'index.html', gulp.series('fileMove'));
    resolve();
  });
});

gulp.task('library', () => {
  return new Promise(resolve => {
    gulp
      .src(['./node_modules/smoothscroll-polyfill/dist/*.js'])
      .pipe(gulp.dest(dir.dist.js + 'smoothscroll-polyfill/'));

    gulp
      .src('./node_modules/swiper/swiper.min.css')
      .pipe((gulp.dest(dir.dist.css)));

    gulp
      .src([
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/swiper/swiper-bundle.min.js'        
      ])
      .pipe((gulp.dest(dir.dist.js)));

    gulp
      .src(src + 'coding_list/**/*.*')
      .pipe((gulp.dest(dist + 'coding_list/')));

    gulp
      .src(src + 'font/**/*.*')
      .pipe((gulp.dest(dist + 'font/')));

    gulp
      .src(src + 'lib/**/*.js')
      .pipe((gulp.dest(dir.dist.js)));
    
    resolve();
  });
});

gulp.task(
  'default',
  gulp.parallel(
    'clean',
    'fileInclude',
    'sass',
    'sassMin',
    'babel',
    'babelMin',
    'imgMin',
    'library',
    // 'fileMove',
	'bundleFileMove',
    'watch',
    'browserSync'
  )
);

gulp.task(
  'build',
  gulp.parallel(
    'clean',
    'fileInclude',
    'sass',
    'sassMin',
    'babel',
    'babelMin',
    'imgMin',
    'library',
	'bundleFileMove'
  )
);
