import gulp from 'gulp';
import gfd from './gfd';
import pkg from './package.json';
import commonTasks from './gfd/common-tasks';
import serve from './gulp/serve';

var g = gfd();
// This call just shows off the default values
g.config({
  appDir: 'app',
  destDir: 'dist',
  moduleDir: 'node_modules',
  bowerDir: 'bower_components'
});

g.appFiles()
  .withExtension('js')
  .noMatch(/^nobabel\//)
  .run(commonTasks.babel({
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .run(commonTasks.minifyJs());
g.appFiles()
  .withExtension('js')
  .match(/^nobabel\//)
  .run(commonTasks.minifyJs());
g.appFiles()
  .withExtension('sass', 'scss')
  .run(commonTasks.compileSass())
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
g.appFiles()
  .withExtension('css')
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
g.appFiles()
  .withExtension('html')
  .run(commonTasks.replace('{{_!_version_!_}}', pkg.version))
  .run(commonTasks.minifyHtml())
g.appFiles()
  .withExtension('jpeg', 'jpg', 'png', 'svg')
  .run(commonTasks.imagemin());
g.bowerFiles()
  .inFolder('moment/min')
  .withName('moment.min.js')
  .run(commonTasks.minifyJs())
  .put('vendor/moment');

gulp.task('build', g.buildTask());
gulp.task('default', gulp.series('build'));
gulp.task('serve', gulp.series('build', serve));
