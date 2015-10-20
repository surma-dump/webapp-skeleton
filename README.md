`http2-skeleton` is a simple base for webapps. It assumes HTTP2 and therefore
has no build steps for concatenation. It also encourages ES2015 modules, SASS
and deferred.

# Build process and usage

If at all, only `gulppipelines.babel.js` should be edited. It matches files
solely by their extension. Every file in `app` or `bower_components` not
matching any of the pipelines will be copied verbatim to `dist`.
There is no dedicated development build. All development is done in `dist` and
you can deploy `dist` at any time.

Run

```
$ gulp
```

to build `dist` or run

```
$ gulp serve
```

to build `dist`, run a (HTTP/1!) web server for local development and
watch for changes to rebuild automatically.

# Remove example code

To have a vanilla basis without any of the example code, run

```
bower uninstall --save moment
echo > app/styles/main.scss
sed -i .bak '1,6d' app/main.js
sed -i .bak '52,57d' app/index.html
rm app/modules/important-date.js app/*.bak
```

# ES2015

Every `*.js` file in `app` will be transpiled with [Babel], except for files
in the `nobabel` folder. Since files in `bower_components` are *not* transpiled
or minified, it might be necessary to vendor some of your dependencies if you
need additional processing to be done on those files.

# License

Apache 2

[Babel]: https://babeljs.io/
