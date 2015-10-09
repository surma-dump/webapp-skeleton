import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export default {
  'js': () => [
    $.sourcemaps.init(),
    $.babel(),
    $.uglify(),
    $.sourcemaps.write('.')
  ],
  'css': () => [
    $.sourcemaps.init(),
    $.autoprefixer({browsers: ['last 2 versions']}),
    $.uglify(),
    $.sourcemaps.write('.')
  ],
  'html': () => [
    $.minifyHtml()
  ],
  '{png,jpeg,jpg}': () => [
    $.imagemin({
      progressive: true,
      interlaced: true
    })
  ]
};
