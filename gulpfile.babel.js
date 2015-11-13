// Generate tasks for each file extension
import pipelines from './gulppipelines.babel.js';
const handledExtensions = {};
Object.keys(pipelines).forEach(extension => {
  handledExtensions[extension] = () => {
    // Instantiate pipeline
    const pipeline = pipelines[extension]();

    var stream = gulp.src([
      'app/**/*.' + extension
    ]);
    stream = pipeline.reduce((stream, step) => stream.pipe(step), stream);
    return stream.pipe(gulp.dest('dist'));
  };

  gulp.task(extension, handledExtensions[extension]);
});

import gulp from 'gulp';
gulp.task('build', gulp.series(
  ...Object.keys(handledExtensions),
  unhandledFiles));
gulp.task('serve', gulp.series('build', serve));
gulp.task('default', gulp.series('build'));

// Glob pattern that matches every file not handled by
// the pipelines defined in `buldingPipelines`
const unhandledFilesGlob = [
  'app/**/*',
  ...Object.keys(pipelines)
    .map(extension => '!app/**/*.' + extension),
  'bower?components/**/*'
];

// Just copy all the files not explicitly processed in `pipelines`
function unhandledFiles() {
  return gulp.src(unhandledFilesGlob, {
    dot: true
  })
  .pipe(gulp.dest('dist'));
};

import browserSync from 'browser-sync';

const defaultBrowserSyncConfig = {
  reloadOnRestart: true,
  open: false
};

function serve() {
  const options = Object.assign({}, defaultBrowserSyncConfig, {
    server: {
      baseDir: 'dist'
    }
  });
  const browserSyncInstance = browserSync.create();
  browserSyncInstance.init(options);

  Object.keys(pipelines).forEach(extension => {
    gulp.watch([
      'app/**/*.' + extension
    ], gulp.series(extension, browserSyncInstance.reload));
  });

  gulp.watch(
    unhandledFilesGlob,
    gulp.series(unhandledFiles, browserSyncInstance.reload));
};
