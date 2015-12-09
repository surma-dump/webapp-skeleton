import gulp from 'gulp';
import gfd from './gfd';
import pkg from './package.json';
import commonTasks from './gfd/common-tasks';
import serve from './gulp/serve';

var g = gfd();

g.filesIn('app')
  .withExtension('js')
  .excluding(/^nobabel\//)
  .run(commonTasks.babel({
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .run(commonTasks.minifyJs());
g.filesIn('app')
  .withExtension('js')
  .matching(/^nobabel\//)
  .run(commonTasks.minifyJs());
g.filesIn('app')
  .withExtension('sass', 'scss')
  .run(commonTasks.compileSass())
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
g.filesIn('app')
  .withExtension('css')
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
g.filesIn('app')
  .withExtension('html')
  .run(commonTasks.replace('{{_!_version_!_}}', pkg.version))
  .run(commonTasks.minifyHtml())
g.filesIn('app')
  .withExtension('jpeg', 'jpg', 'png', 'svg')
  .run(commonTasks.imagemin());
g.filesIn('bower_components')
  .inFolder('moment/min')
  .withName('moment.min.js')
  .run(commonTasks.minifyJs())
  .put('vendor/moment');

gulp.task('build', g.buildTask());
gulp.task('default', gulp.series('build'));
gulp.task('serve', gulp.series('build', serve));
