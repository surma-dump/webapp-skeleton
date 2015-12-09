import gulp from 'gulp';
import browserSync from 'browser-sync';

const defaultBrowserSyncConfig = {
  reloadOnRestart: true,
  open: false
};

export default function serve() {
  const options = Object.assign({}, defaultBrowserSyncConfig, {
    server: {
      baseDir: 'dist'
    }
  });
  const browserSyncInstance = browserSync.create();
  browserSyncInstance.init(options);

  gulp.watch('app/**/*', gulp.series('build'));
}
