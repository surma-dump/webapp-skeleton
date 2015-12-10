var gulp = require('gulp');
var through = require('through2');
var merge = require('merge-stream');
var path = require('path');

var defaultConfig = {
  destDir: 'dist'
};

function FileOperationCollection(path) {
  this.steps = [function() {
    return gulp.src(path + '/**/*', {dot: true});
  }];
}

FileOperationCollection.prototype.filter = function(filterFunc) {
  this.steps.push(function(stream) {
    return stream.pipe(through.obj(function(file, enc, cb) {
      if(filterFunc.call(this, file)) {
        cb(null, file);
        return;
      }
      cb(null);
    }.bind(this)));
  });
  return this;
};

FileOperationCollection.prototype.withExtension = function() {
  var exts = Array.prototype.map.call(arguments, function(ext) {
    return '.' + ext;
  });

  return this.filter(function(file) {
    var fileExt = path.extname(file.path)
    return exts.map(function(ext) {
      return fileExt === ext;
    }).indexOf(true) !== -1;
  });
};

FileOperationCollection.prototype.withName = function(name) {
  this.filter(function(file) {
    return path.basename(file.path) === name;
  });
  return this;
};

FileOperationCollection.prototype.matching = function(regexp) {
  return this.filter(function(file) {
    return regexp.test(file.relative);
  });
};

FileOperationCollection.prototype.excluding = function(regexp) {
  return this.filter(function(file) {
    return !regexp.test(file.relative);
  });
};

FileOperationCollection.prototype.inFolder = function(name) {
  return this.filter(function(file) {
    var doesMatch = file.relative.startsWith(name);
    if(doesMatch) {
      file.base = path.join(file.base, name);
    }
    return doesMatch;
  });
};

FileOperationCollection.prototype.run = function(taskFactory, opts) {
  opts = opts || {};
  if(opts.skip) {
    return this;
  }

  this.steps.push(function(stream) {
    return stream.pipe(taskFactory());
  });
  return this;
};

FileOperationCollection.prototype.runGulp = function(gulpTaskFactory, gulpTaskOpts, opts) {
  return this.run(function() {
    return gulpTaskFactory(gulpTaskOpts);
  }, opts);
};

var eatStream = function() {
  return through.obj(function(file, enc, cb) {
    cb(null);
  });
};

FileOperationCollection.prototype.put = function(dest) {
  var newDest = path.join(this.config.destDir, dest);
  this.steps.push(function(stream) {
    return stream
      .pipe(gulp.dest(newDest))
      .pipe(eatStream());
  });
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
      var newStream = new FileOperationCollection(folder);
      newStream.config = config;
      this.pipes.push(newStream);
      return newStream;
    },
    build: function() {
      return function() {
        var streams = this.pipes.map(function(task) {
          return task.steps.reduce(function(stream, step) {
            return step(stream);
          }, null).pipe(gulp.dest(config.destDir));
        });
        return merge(streams);
      }.bind(this);
    }
  };
};
