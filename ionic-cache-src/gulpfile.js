var gulp = require('gulp'),
	del = require('del'),
	versioner = require('./utils/versioner'),
	readme = require('./utils/readme');

gulp.task('clean', () => {
	return del(['./aot', './dist']);
});

gulp.task('version', () => versioner());
gulp.task('readme', () => readme());

gulp.task('default', ['readme', 'clean', 'version']);