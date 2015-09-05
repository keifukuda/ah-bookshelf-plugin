var gulp = require("gulp");
var babel = require("gulp-babel");
var del = require("del");

var paths = {
  src: "src/**/*.js",
  dest: "./"
};

var cleanDirectories = ["initializers", "grunt", "utils"];

gulp.task("clean", function() {
  del.sync(cleanDirectories);
});

gulp.task("babel", ["clean"], function() {
  gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dest));
});

gulp.task("watch", ["build"], function() {
  gulp.watch(paths.src, ["babel"]);
});

gulp.task("build", ["babel"]);

gulp.task("default", ["watch"]);
