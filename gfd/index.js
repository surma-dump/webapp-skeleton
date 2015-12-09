var gulp = require('gulp');
var through = require('through2');
var merge = require('merge-stream');
var path = require('path');

var defaultConfig = {
  destDir: 'dist'
};

function StreamWrapper(path) {
  this.stream = gulp.src(path + '/**/*');
}

StreamWrapper.prototype.filter = function(filterFunc) {
  this.stream = this.stream.pipe(through.obj(function(file, enc, cb) {
    if(filterFunc.call(this, file)) {
      cb(null, file);
      return;
    }
    cb(null);
  }.bind(this)));
  return this;
};

StreamWrapper.prototype.withExtension = function() {
  var exts = Array.prototype.slice.call(arguments);
  return this.filter(function(file) {
    var fileExt = path.extname(file.path)
    return exts.map(function(ext) {
      return fileExt === '.' + ext;
    }).indexOf(true) !== -1;
  });
};

StreamWrapper.prototype.withName = function(name) {
  this.filter(function(file) {
    return path.basename(file.path) === name;
  });
  return this;
};

StreamWrapper.prototype.matching = function(regexp) {
  return this.filter(function(file) {
    return regexp.test(file.relative);
  });
};

StreamWrapper.prototype.excluding = function(regexp) {
  return this.filter(function(file) {
    return !regexp.test(file.relative);
  });
};

StreamWrapper.prototype.inFolder = function(name) {
  return this.filter(function(file) {
    var doesMatch = file.relative.startsWith(name);
    if(doesMatch) {
      file.base = path.join(file.base, name);
    }
    return doesMatch;
  });
};

StreamWrapper.prototype.run = function(task, opts) {
  opts = opts || {};
  if(opts.skip) {
    return this;
  }

  this.stream = this.stream.pipe(task);
  return this;
};

var eatStream = through.obj(function(file, enc, cb) {
  cb(null);
});

StreamWrapper.prototype.put = function(dest) {
  var newDest = path.join(this.config.destDir, dest);
  this.stream = this.stream
    .pipe(gulp.dest(newDest))
    .pipe(eatStream);
  return this;
};


module.exports = function(cfg) {
  var config = Object.assign({}, defaultConfig, cfg);

  return {
    config: function(cfg) {
      config = Object.assign(config, cfg);
      return config;
    },
    pipes: [],
    filesIn: function(folder) {
      var newStream = new StreamWrapper(folder);
      newStream.config = config;
      this.pipes.push(newStream);
      return newStream;
    },
    buildTask: function() {
      return function() {
        var pipes = this.pipes.map(function(task) {
          return task.stream.pipe(gulp.dest(config.destDir));
        }.bind(this));
        return merge(pipes);
      }.bind(this);
    }
  };
};
