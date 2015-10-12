import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export default {
  'js': () => [
    $.sourcemaps.init(),
    // Exclude files in `app/nobabel`
    $.if(file => !/^nobabel\//.test(file.relative),
      $.babel({
        // Use AMD for RequireJS
        modules: 'amd'
      })
    ),
    $.uglify(),
    $.sourcemaps.write('.')
  ],
  '{sass,scss}': () => [
    $.sourcemaps.init(),
    $.sass({
      precision: 10
    }).on('error', $.sass.logError),
    $.autoprefixer({browsers: ['last 2 versions']}),
    $.minifyCss(),
    $.sourcemaps.write('.')
  ],
  'css': () => [
    $.sourcemaps.init(),
    $.autoprefixer({browsers: ['last 2 versions']}),
    $.minifyCss(),
    $.sourcemaps.write('.')
  ],
  'html': () => [
    $.minifyInline(),
    $.minifyHtml()
  ],
  '{png,jpeg,jpg}': () => [
    $.imagemin({
      progressive: true,
      interlaced: true
    })
  ]
};
