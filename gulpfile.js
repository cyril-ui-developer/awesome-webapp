const gulp = require("gulp");
const inject = require("gulp-inject");
const webserver = require("gulp-webserver");
const htmlclean = require("gulp-htmlclean");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const del = require("del");
const sass = require("gulp-sass");

const paths = {
  src: "src/**/*",
  srcHTML: "src/**/*.html",
  srcSASS: "src/**/*.sass",
  srcJS: "src/**/*.js",

  tmp: "tmp",
  tmpIndex: "tmp/index.html",
  tmpCSS: "tmp/**/*.css",
  tmpJS: "tmp/**/*.js",

  dist: "dist",
  distIndex: "dist/index.html",
  distCSS: "dist/**/*.css",
  distJS: "dist/**/*.js"
};

//html task
gulp.task("html", function() {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

// sass task
gulp.task("sass", function() {
  return gulp
    .src(paths.srcSASS)
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(paths.tmp));
});

gulp.task("css", function() {
  return sass(paths.srcSASS).pipe(gulp.dest(paths.tmp));
});

// css task
// gulp.task("css", function() {
//   return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
// });

//html task
gulp.task("js", function() {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

// copy task
gulp.task("copy", ["html", "sass", "js"]);

// inject task
gulp.task("inject", ["copy"], function() {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp
    .src(paths.tmpIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, { relative: true }))
    .pipe(gulp.dest(paths.tmp));
});

// web server
gulp.task("serve", ["inject"], function() {
  return gulp.src(paths.tmp).pipe(
    webserver({
      port: 3000,
      livereload: true
    })
  );
});
//watch task
gulp.task("watch", ["serve"], function() {
  gulp.watch(paths.src, ["inject"]);
});

// default
gulp.task("default", ["watch"]);

// production build script
gulp.task("html:dist", function() {
  return gulp
    .src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task("sass:dist", function() {
  return gulp
    .src(paths.tmpCSS)
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
gulp.task("js:dist", function() {
  return gulp
    .src(paths.srcJS)
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});
gulp.task("copy:dist", ["html:dist", "sass:dist", "js:dist"]);
gulp.task("inject:dist", ["copy:dist"], function() {
  const css = gulp.src(paths.distCSS);
  const js = gulp.src(paths.distJS);
  return gulp
    .src(paths.distIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, { relative: true }))
    .pipe(gulp.dest(paths.dist));
});
gulp.task("build", ["inject:dist"]);

// clean tmp and dist folders
gulp.task("clean", function() {
  del([paths.tmp, paths.dist]);
});
