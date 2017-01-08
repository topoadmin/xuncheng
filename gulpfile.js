var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'), //自动添加浏览器前缀
	filter = require('gulp-filter'),
	browserSync = require('browser-sync').create(), //浏览器自动刷新
	less = require('gulp-less');

//定义js,css,images文件的路径
var paths = {
	css: './css/*.css',
	less: './less/**/*.less',
	html: './*.html',
	js:'./js/*.js'
};
//浏览器自动刷新
gulp.task('browserSync', function() {
	browserSync.init({
//		files: "**",
		open: false,
		notify: false,
		scrollProportionally: false,
		port: 1103,
		server: {
			baseDir: "./"
		}
	});
});

// 编译less
gulp.task('compileLess', function() {
	gulp.src(['./less/*.less'])
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./css'))
		.pipe(filter(paths.css))
});


gulp.task('watchLess', function() {
	gulp.watch([paths.css,paths.html,paths.js, './**/*.html'], browserSync.reload);
	gulp.watch(paths.less, ['compileLess']); //当所有less文件发生改变时，调用compileLess任务
	gulp.watch(['./js/data/*.json'], browserSync.reload);
});

//定义默认任务
gulp.task('default', ['browserSync', 'watchLess', 'compileLess']);