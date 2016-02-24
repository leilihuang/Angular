var gulp=require('gulp'),
    less=require('gulp-less'),
    concat=require('gulp-concat'),
    watch=require('gulp-watch'),
    clean=require('gulp-clean'),
    replace=require('gulp-replace'),
    cssmin=require('gulp-minify-css'),
    js=require('gulp-requirejs-optimize'),
    spriter = require('gulp-css-spriter');

var webpack=require('webpack');

/**
 * 使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀。使用她我们可以很潇洒地写代码，不必考虑各浏览器兼容前缀
 * */
var path=require('path'),file=require('fs');
var user_config=JSON.parse(file.readFileSync('./userConfig.json',{encoding:"UTF-8"}));
var user_empty=JSON.parse(file.readFileSync('./empty.json',{encoding:"UTF-8"}));



gulp.task('less', function () {
    gulp.src('./page/css/*.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsConcat', function () {
    return gulp.src('./entries/action/*.js')
    .pipe(js(function (file) {
            return {
                name: 'entries/action/'+file.relative,
                optimize: 'none',
                useStrict: true,
                baseUrl: './',
                mainConfigFile: "entries/main.js",
                removeCombined:true,
                paths:user_empty,
                include: 'entries/main'
            }
        }))
    .pipe(gulp.dest('./dist/js/'))
});
gulp.task('concat', function () {
    gulp.src('./dist/css/*.css')
    .pipe(concat("./font/ds/demo.css"))
    .pipe(gulp.dest('./dist/css/min/'))
});

gulp.task('spring', function () {
    var timestamp=+new Date();
    gulp.src('./dist/css/*.css')
    .pipe(spriter({
            'spriteSheet':'./dist/img/spring/sprite'+timestamp+'.png',
            'pathToSpriteSheetFromCSS':'../img/spring/sprite'+timestamp+'.png'
     }))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('copy', function () {
    gulp.src('./page/img/**/*.*')
    .pipe(gulp.dest('./dist/img'))
});
gulp.task('clear', function () {
    gulp.src('./dist',{read:false})
    .pipe(clean())
});
gulp.task('watch', function () {
    gulp.watch('./entries/**/*.js',['jsConcat']);
    //gulp.watch('./page/css/**/*.less',['less']);
    //gulp.watch('./page/img/**/*.png',['copy']);
});


/**
 * test  是测试环境地址替换js  ajax端口location
 * pro   是正式环境地址替换*/
gulp.task('replace:text', function () {
   return gulp.src('./dist/js/*.js')
       .pipe(replace('%baseUrl%',user_config.test.baseUrl))
       .pipe(replace('%loginUrl%',user_config.test.logUrl))
        .pipe(gulp.dest("./dist/js/"))
});
gulp.task('replace:pro', function () {
    return gulp.src('./dist/js/*.js')
        .pipe(replace('%baseUrl%',user_config.pro.baseUrl))
        .pipe(replace('%loginUrl%',user_config.pro.logUrl))
    .pipe(gulp.dest("./dist/js/"))
});

gulp.task("html:test", function () {
    return gulp.src("./dist/html/*.html")
    .pipe(replace("%baseUrl%",user_config.test.html_url))
    .pipe(gulp.dest("./dist/html/"))
});
gulp.task("html:pro", function () {
    return gulp.src("./dist/html/*.html")
        .pipe(replace("%baseUrl%",user_config.pro.html_url))
        .pipe(gulp.dest("./dist/html/"))
});

gulp.task('default',['copy','less','spring','watch']);
gulp.task('pro',['copy','less','jsConcat','spring']);
