
var path = require('path');
var fs = require('fs');
var yargs = require('yargs').argv;
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var pkg = require('./package.json');

var option = {base: 'src'};
var dist = __dirname + '/dist';

gulp.task('source', function(){
    gulp.src('src/example/**/*.!(less|html)', option)
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', ['source'], function () {
    gulp.src('src/example/example.less', option)
        .pipe(less().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(nano())
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));

    gulp.src('src/example/index.html', option)
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();
            contents = contents.replace(/<link\s+rel="import"\s+href="(.*)">/gi, function (match, $1){
                var filename = path.join(dir, $1);
                var id = path.basename(filename, '.html');
                var content = fs.readFileSync(filename, 'utf-8');
                return '<script type="text/html" id="tpl_'+ id +'">\n'+ content +'\n</script>';
            });
            file.contents = new Buffer(contents);
        }))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));

    var banner = [
        '/*!',
        ' * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)',
        ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
        ' * Licensed under the <%= pkg.license %> license',
        ' */',
        ''].join('\n');
    gulp.src('src/style/weui.less', option)
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer]))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist))
        .pipe(nano())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('release', ['styles']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.less', ['styles']);
    gulp.watch('src/example/**/*.{html,js}', ['source'], function () {
        browserSync.reload();
    });
});

gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/example'
    });
});


// ????????????
//  -w: ????????????
//  -s: ???????????????
//  -p: ??????????????????????????????8080
gulp.task('default', ['release'], function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});