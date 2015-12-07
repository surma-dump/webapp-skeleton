import gulp from 'gulp';
import gfd from './gfd';
import pkg from './package.json';
import commonTasks from './gfd/common-tasks';
import serve from './gulp/serve';

gfd.appFiles()
  .withExtension('js')
  .noMatch(/^nobabel\//)
  .run(commonTasks.babel({
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .run(commonTasks.minifyJs());
gfd.appFiles()
  .withExtension('js')
  .match(/^nobabel\//)
  .run(commonTasks.minifyJs());
gfd.appFiles()
  .withExtension('sass', 'scss')
  .run(commonTasks.compileSass())
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
gfd.appFiles()
  .withExtension('css')
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
gfd.appFiles()
  .withExtension('html')
  .run(commonTasks.replace('{{_!_version_!_}}', pkg.version))
  .run(commonTasks.minifyHtml())
gfd.appFiles()
  .withExtension('jpeg', 'jpg', 'png', 'svg')
  .run(commonTasks.imagemin());
gfd.bowerFiles()
  .inFolder('moment/min')
  .withName('moment.min.js')
  .run(commonTasks.minifyJs())
  .put('vendor/moment');

gulp.task('build', gfd.buildTask());
gulp.task('default', gulp.series('build'));
gulp.task('serve', gulp.series('build', serve));
