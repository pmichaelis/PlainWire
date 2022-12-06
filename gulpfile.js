const gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass')(require('sass')),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    minify = require('gulp-minify'),
    parcel = require('gulp-parcel');

gulp.task('clean', function () {
    return del('./.cache', { force: true });
});

// css
gulp.task('css', (done) => {
    gulp.src('./src/scss/PlainWire.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules']
        }))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(autoprefixer({
            cascade: false,
            remove: false,
            grid: true
        }))
        .pipe(gulp.dest('./dist/css/'));
    done();
});

// scripts
gulp.task('js', function () {
    return gulp.src('./src/js/PlainWire.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            }
        }))
        .pipe(gulp.dest('./dist/js/'));
});

// parcel
gulp.task('parcel', (done) => {
    return gulp.src('./src/js/PlainWire.js', { read: false })
        .pipe(parcel())
        // .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./dist/js/'));
    done();
});

// images
gulp.task('images', (done) => {
    gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
    done();
});

// fonts
gulp.task('fonts', (done) => {
    gulp.src('./fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
    done();
});

gulp.task('scripts', gulp.series('js', 'parcel', 'clean'));
gulp.task('styles', gulp.series('css'));
gulp.task('all', gulp.series('styles', 'scripts', 'images', 'fonts'));
gulp.task('default', gulp.series('styles', 'scripts'));

// watch
gulp.task('watch', () => {
    gulp.watch('./site/templates/src/scss/**/*.scss', gulp.series('css'));
    gulp.watch('./site/templates/src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('./site/templates/src/img/**/*', gulp.series('images'));
    gulp.watch('./site/templates/src/fonts/**/*', gulp.series('fonts'));
});

