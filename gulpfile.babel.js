import gulp from 'gulp';
import gtb from './gtb';
import pkg from './package.json';
import commonTasks from './gtb/common-tasks';
import serve from './gulp-tasks/serve';

var task = gtb();
// gtb implicitly outputs all the files to `dest` unless
// they have already been written with `put()`.
// Default value:
task.config({
  dest: 'dist'
});

task.filesIn('app')
  .withExtension('js')
  .excluding(/^nobabel\//)
  .run(commonTasks.babel({
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .run(commonTasks.minifyJs());
task.filesIn('app')
  .withExtension('js')
  .matching(/^nobabel\//)
  .run(commonTasks.minifyJs());
task.filesIn('app')
  .withExtension('sass', 'scss')
  .run(commonTasks.compileSass())
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
task.filesIn('app')
  .withExtension('css')
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss());
task.filesIn('app')
  .withExtension('html')
  .run(commonTasks.replace('{{_!_version_!_}}', pkg.version))
  .run(commonTasks.minifyHtml())
task.filesIn('app')
  .withExtension('jpeg', 'jpg', 'png', 'svg')
  .run(commonTasks.imagemin());
task.filesIn('bower_components')
  .inFolder('moment/min')
  .withName('moment.min.js')
  .run(commonTasks.minifyJs())
  .put('vendor/moment');

gulp.task('build', task.build());
gulp.task('default', gulp.series('build'));
gulp.task('serve', gulp.series('build', serve));
