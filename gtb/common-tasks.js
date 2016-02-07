var minifyCss = require('gulp-cssnano');
var minifyHtml = require('gulp-htmlmin');
var minifyInline = require('gulp-minify-inline');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var through = require('through2')
var streamCombiner = require('stream-combiner');

module.exports = {
  compileSass: function(opts) {
    return function() {
      return sass(opts);
    };
  },
  autoprefixer: function(opts) {
    return function() {
      return autoprefixer(opts);
    };
  },
  minifyCss: function(opts) {
    return function() {
      return minifyCss(opts);
    };
  },
  minifyJs: function(opts) {
    return function() {
      return uglify(opts);
    };
  },
  minifyHtml: function(opts) {
    if(typeof opts === 'undefined') {
      opts = {};
    }
    return function() {
      return streamCombiner(
        minifyHtml(opts.html || {
          minifyCSS: true,
          minifyJS: true,
          removeScriptTypeAttributes: true,
          collapseBooleanAttributes: true,
          removeTagWhitespace: true,
          collapseWhitespace: true,
          removeComments: true
        }),
        minifyInline(opts.inline || {})
      );
    };
  },
  imagemin: function(opts) {
    return function() {
      return imagemin(opts);
    };
  },
  babel: function(opts) {
    return function() {
      return babel(opts);
    };
  },
  replace: function(needle, haystack) {
    return function() {
      return replace(needle, haystack);
    };
  },
  log: function(prefix) {
    return function() {
      return through.obj(function(file, enc, cb) {
        console.log(prefix+':', file.relative, '(' + file.path + ')');
        cb(null, file);
      });
    };
  }
};
