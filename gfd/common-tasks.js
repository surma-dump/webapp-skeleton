var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var minifyInline = require('gulp-minify-inline');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

module.exports = {
  compileSass: function(opts) {
    return function(task) {
      return task.runGulp(sass(opts));
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
    return function(task) {
      return task
        .runGulp(minifyHtml(opts.html || {}))
        .runGulp(minifyInline(opts.inline || {}));
    };
  },
  babel: function(opts) {
    return function(task) {
      return task.runGulp(babel(opts));
    }
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
