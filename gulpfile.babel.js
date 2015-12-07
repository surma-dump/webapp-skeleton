import gulp from 'gulp';
import gfd from './gfd';
import commonTasks from './gfd/common-tasks';
import browserSync from 'browser-sync';

gfd.appFiles()
  .withExtension('json', 'html');
gfd.bowerFiles()
  .inFolder('moment/min')
  .withName('moment.min.js')
  .run(commonTasks.minifyJs())
  .put('vendor/moment');

gulp.task('build', gfd.buildTask());
gulp.task('default', gulp.series('build'));

gulp.task('serve', gulp.series('build', serve));

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

  gulp.watch('app/**/*', 'build');
}
