`webapp-skeleton` is a simple base for webapps. It assumes HTTP2 and therefore
has no build steps for concatenation. It also encourages ES2015 modules, SASS
and deferred.

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
echo | tee app/styles/main.scss
sed --in-place=.bak '1,6d' app/main.js
sed --in-place=.bak '52,57d' app/index.html
sed --in-place=.bak '43,47d' gulpfile.babel.js
rm app/modules/important-date.js app/*.bak *.bak
```

# ES2015

Every `*.js` file in `app` will be transpiled with [Babel], except for files
in the `nobabel` folder.

# License

Apache 2

[Babel]: https://babeljs.io/

---
Version 0.1.0
