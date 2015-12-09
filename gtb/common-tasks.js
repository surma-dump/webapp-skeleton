var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
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
    return sass(opts);
  },
  autoprefixer: function(opts) {
    return autoprefixer(opts);
  },
  minifyCss: function(opts) {
    return minifyCss(opts);
  },
  minifyJs: function(opts) {
    return uglify(opts);
  },
  minifyHtml: function(opts) {
    if(typeof opts === 'undefined') {
      opts = {html: {}, inline: {}};
    }
    return streamCombiner(
      minifyHtml(opts.html || {}),
      minifyInline(opts.inline || {})
    );
  },
  imagemin: function(opts) {
    return imagemin(opts);
  },
  babel: function(opts) {
    return babel(opts);
  },
  replace: function(needle, haystack) {
    return replace(needle, haystack);
  },
  log: function(prefix) {
    return through.obj(function(file, enc, cb) {
      console.log(prefix+':', file.relative, '(' + file.path + ')');
      cb(null, file);
    });
  }
};
