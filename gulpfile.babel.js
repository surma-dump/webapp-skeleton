import gfd from './gfd';
import commonTasks from './gfd/common-tasks';

gfd.appFiles().withExtension('json', 'html');
gfd.bowerFiles().inFolder('moment').inFolder('src').withName('moment.js').run(commonTasks.minifyJs());

gulp.task('build', gfd.buildTask());
gulp.task('default', gulp.series('build'));

import gulp from 'gulp';
gulp.task('serve', gulp.series('build', serve));

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
