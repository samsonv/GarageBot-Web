var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', ['build']);

gulp.task('build', ['js', 'html']);

gulp.task('js', function(){
   return gulp.src('src/js/main.jsx')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('wwwroot/js/')); 
});

gulp.task('html', function(){
    return gulp.src('src/index.html')
    .pipe(gulp.dest('wwwroot/'))
})