//var gulp = require('gulp');
//var babel = require('gulp-babel');
//var server = require('gulp-server-livereload');
//var watch = require('gulp-watch');
//
//gulp.task('serve', function() {
//    gulp.src('dist')
//        .pipe(server({
//            livereload: true,
//            directoryListing: true,
//            open: true
//        }));
//});
//
//gulp.task('connect', function() {
//    connect.server({
//        root: 'app',
//        livereload: true
//    });
//});
//
//gulp.task('watch', ['serve'], function () {
//    gulp.watch('src/babel/es6.js');
//});
//
//gulp.task('default', ['watch'], function () {
//    return gulp.src('src/babel/es6.js')
//        .pipe(babel())
//        .pipe(gulp.dest('dist'));
//});

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload'),
    http = require('http'),
    st = require('st');

gulp.task('js', ["es6"],function() {

    return gulp.src("src/babel/es6.js")
        .pipe(babel())
        .pipe(gulp.dest("./dist"))
        .pipe(livereload());

});

gulp.task("es6",function() {
    return gulp.src("src/babel/es6.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));

});


gulp.task("default",["js"],function(done) {
    http.createServer(
        st({ index: 'index.html', cache: false, path: __dirname })
    ).listen(8080, done);
    livereload.listen();
    gulp.watch('src/*', ['js']);
});