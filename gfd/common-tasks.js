var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var minifyInline = require('gulp-minify-inline');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');

module.exports = {
  compileSass: function(opts) {
    return function(task) {
      return task.runGulp(sass(opts));
    };
  },
  autoprefixer: function(opts) {
    return function(task) {
      return task.runGulp(autoprefixer(opts));
    };
  },
  minifyCss: function(opts) {
    return function(task) {
      return task.runGulp(minifyCss(opts));
    };
  },
  minifyJs: function(opts) {
    return function(task) {
      return task.runGulp(uglify(opts));
    };
  },
  minifyHtml: function(opts) {
    if(typeof opts === 'undefined') {
      opts = {html: {}, inline: {}};
    }
    return function(task) {
      return task
        .runGulp(minifyHtml(opts.html || {}))
        .runGulp(minifyInline(opts.inline || {}));
    };
  },
  imagemin: function(opts) {
    return function(task) {
      return task.runGulp(imagemin(opts));
    };
  },
  babel: function(opts) {
    return function(task) {
      return task.runGulp(babel(opts));
    };
  },
  replace: function(needle, haystack) {
    return function(task) {
      return task.runGulp(replace(needle, haystack));
    };
  },
  log: function(prefix) {
    return function(task) {
      return task.filter(function(file) {
        console.log(prefix+':', file.relative, '(' + file.path + ')');
        return true;
      });
    }
  }
};
