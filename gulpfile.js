var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $ = gulpLoadPlugins();
var del = require('del');
var browserSync = require('browser-sync').create();

var source = './src', target = './dist';

gulp.task('sass', function() {
    return gulp.src(source + '/scss/main.scss')
        .pipe($.sass({ style: 'expanded' }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest(source + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(source + '/js/**/*.js')
        .pipe($.eslint());
});

gulp.task('images', function () {
    return gulp.src(source + '/assets/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(target + '/assets/images'))
        .pipe($.size());    
});

gulp.task('fonts', function() {
    return gulp.src(source + '/assets/fonts/*')
        .pipe(gulp.dest(target + '/assets/fonts'));
});

gulp.task('build', ['sass', 'images'], function() {
    return gulp.src('./index.html')
        .pipe($.usemin({
            html: [ 
                $.htmlmin({ 
                    collapseWhitespace: true 
                }) 
            ],
            css: [
                $.cssnano(),
                $.rev()
            ],
            js: [
                $.uglify(),
                $.rev()
            ]
        }))
        .pipe(gulp.dest(target));
});

gulp.task('clean', function() {
    return del([target]); 
});

gulp.task('serve', ['sass', 'scripts'], function() {
    browserSync.init({
        server: './'
    });
    gulp.watch(source + '/js/**/*.js', ['scripts']);
    gulp.watch(source + '/scss/**/*.scss', ['sass']);
    gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
