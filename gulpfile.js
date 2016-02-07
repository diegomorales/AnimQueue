var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    umd = require('gulp-umd'),
    path = require('path');

var devPath = 'src/',
    distPath = 'dist/';


// dev tasks
gulp.task('js', function(){
    return gulp.src(devPath + '**/*.js')
        .pipe(umd({
            templateName: 'amdCommonWeb',
            exports: function(file) {
                return path.basename(file.path, path.extname(file.path));
            },

            namespace: function(file) {
                return path.basename(file.path, path.extname(file.path));
            }
        }))
        .pipe(gulp.dest(distPath))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('lint', function(){
    gulp.src(devPath + '**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('default', ['lint', 'js'],function(){
    gulp.watch(devPath + '**/*.js', ['lint', 'js']);
});
