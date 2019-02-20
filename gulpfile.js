//npm i -D bourbon gulp autoprefixer browser-sync cssnano gulp-eslint gulp-sass gulp-rename gulp-postcss gulp-plumber webpack webpack-stream

// npm i -D @babel/core @babel/preset-env babel-loader

"use strict";

const { series, parallel, src, dest, watch } = require('gulp');

const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const bourbon = require("bourbon").includePaths;
const cssnano = require("cssnano");
const eslint = require("gulp-eslint");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");

var basePaths = {
  src: 'dev/',
  dest: 'dist/'
};
var paths = {
  scripts: {
    src: basePaths.src + 'scripts/',
    dest: basePaths.dest + 'js/'
  },
  styles: {
    src: basePaths.src + 'scss/',
    dest: basePaths.dest + 'css/'
  }
};

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}
// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS task
function css(cb) {
  return src(paths.styles.src + 'styles.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded", includePaths: bourbon }))
    .pipe(dest(paths.styles.dest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(paths.styles.dest))
    .pipe(browsersync.stream({match: '**/*.css'}))
    cb();
}
// Lint scripts
function scriptsLint() {
  return src([paths.scripts.src + '**/*', "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}
// Transpile, concatenate and minify scripts
function scripts(cb) {
  return src(paths.scripts.src + '**/*')
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack))
      // folder only, filename is specified in webpack config
      .pipe(dest(paths.scripts.dest))
      .pipe(browsersync.stream())
  cb();
}
// Watch files
function watchFiles() {
  watch( paths.styles.src + '**/*', css);
  watch( paths.scripts.src + '**/*', series(scriptsLint, scripts));
  watch( './**/*.html',browserSyncReload);
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = parallel(scripts, css);
