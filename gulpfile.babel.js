import gulp from 'gulp';
import browserSync from 'browser-sync';
import pkg from './package.json';

const bs = browserSync.create();

// Pipelines for each file extension
import pipelines from './gulppipelines.babel.js';

// Glob pattern that matches every file not handled by
// the pipelines defined in `buldingPipelines`
const everythingElseGlob = [
  'app/**/*',
  ...Object.keys(pipelines)
    .map(extension => '!app/**/*.' + extension),
  'bower?components/**/*'
];

const defaultBsConfig = {
  directory: true,
  reloadOnRestart: true,
  open: false
};

// Serve app directory with mounted bower components
gulp.task('serve', () => {
  const options = Object.assign({}, defaultBsConfig, {
    server: {
      baseDir: 'app',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });
  bs.init(options);
  gulp.watch([
    'app/**/*',
    'bower_components/**/*'
  ]).on('change', bs.reload);
});

// Serve the built app
gulp.task('serve:dist', ['build'], () => {
  const options = Object.assign({}, defaultBsConfig, {
    server: {
      baseDir: 'dist'
    }
  });
  bs.init(options);

  Object.keys(pipelines).forEach(extension => {
    gulp.watch([
      'app/**/*.' + extension
    ], [extension, bs.reload]);
  });
  gulp.watch(everythingElseGlob, ['everything-else', bs.reload]);
});

// Build the app and put it in `dist`
gulp.task('default', ['build']);
gulp.task('build', [...Object.keys(pipelines), 'everything-else']);

// Generate tasks defined in `gulppipelines.babel.js`
Object.keys(pipelines).forEach(extension => {
  gulp.task(extension, () => {
    var stream = gulp.src([
      'app/**/*.' + extension
    ]);
    stream = pipelines[extension]()
      .reduce((stream, pipe) => stream.pipe(pipe), stream);
    return stream.pipe(gulp.dest('dist'));
  });
});

// Just copy all the files not explicitly processed in `pipelines`
gulp.task('everything-else', () => {
  return gulp.src(everythingElseGlob, {
    dot: true
  })
  .pipe(gulp.dest('dist'));
});
