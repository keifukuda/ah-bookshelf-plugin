var gulp = require("gulp");
var babel = require("gulp-babel");
var del = require("del");

var paths = {
  src: "src/**/*.js",
  dest: "./"
};

var cleanDirectories = ["initializers", "grunt", "utils"];

gulp.task("clean", function(cb) {
  del(cleanDirectories, cb);
});

gulp.task("babel", ["clean"], function() {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dest));
});

gulp.task("watch", ["build"], function() {
  gulp.watch(paths.src, ["babel"]);
});

gulp.task("build", ["babel"]);

gulp.task("default", ["watch"]);
