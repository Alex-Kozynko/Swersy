var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber      = require('gulp-plumber'),
    browserSync  = require('browser-sync'),
    del          = require('del'),
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cache        = require('gulp-cache'),
    rigger 		 = require('gulp-rigger'),
    webp         = require('gulp-webp'),
    replace      = require('gulp-replace'),
    image        = require('gulp-image'),
    newer        = require('gulp-newer'),
    cached       = require('gulp-cached'),
    dependents   = require('gulp-dependents'),
    responsive   = require('gulp-responsive'),
    rename       = require("gulp-rename");

gulp.task('html', function () {
    return gulp.src(['dev/temp/**/*.html', 'dev/temp/**/.htaccess', '!dev/temp/include/**/*.html'])
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest('app/', function(file) {
            return file.base
        }))
        .pipe(browserSync.stream({match: '**/*.html'}));
});

sass.compiler = require('node-sass');
gulp.task('sass', function () {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(plumber())
        .pipe(cached('scss'))
        .pipe(dependents())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: {
            baseDir: 'app'
        }

    });
});

gulp.task('scripts', function() {
    return gulp.src('dev/js/**/*.js')
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('img', function() {
    return gulp.src('dev/img-big/**/*.*') // Берем все изображения из app
        .pipe(rename(function (file) {
            file.basename = file.basename.toLowerCase();
        }))
        .pipe(newer('app/img'))
        .pipe(image())
        .pipe(gulp.dest('app/img')); // Выгружаем на продакшен
});

gulp.task('img_size', function () {
    return gulp.src(['dev/img-big/**/*.{jpg,png}', '!dev/img-big/mobi/**/*.*'])
        .pipe(newer('dev/img-big/mobi'))
        .pipe(responsive({
            '**/*': {
                width: '50%',
            },
        }))
        .pipe(gulp.dest('dev/img-big/mobi', function(file) {
            return file.base
        }));
});

gulp.task('clear-cache', () =>
    cache.clearAll()
);

gulp.task('watch', gulp.parallel('browser-sync', 'sass', 'scripts', 'html', 'img', () => {
    gulp.watch('dev/scss/**/*.scss', gulp.series(/*'clean_css',*/ 'sass'));
    gulp.watch('dev/temp/**/*.html', gulp.series(/*'clean_html',*/ 'html'));
    gulp.watch('dev/js/**/*.js', gulp.series('scripts'));
    gulp.watch('dev/img-big/', gulp.series('img'));
    gulp.watch(['app/img/**/*.{jpg,png}','!app/img/mobi/**/*.*'],  gulp.series('img_size'));
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
}));
