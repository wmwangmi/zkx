var gulp = require('gulp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync').create();
// var phpMinify = require('gulp-php-minify');
// var phpMinify = require('@aquafadas/gulp-php-minify');
var htmlMinify = require('gulp-htmlmin');
var postcss = require('gulp-postcss'); 
// var cssnano = require('gulp-cssnano');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var imagemin = require('gulp-imagemin');
var ifElse = require('gulp-if-else');
var base64 = require('gulp-base64');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var watchs = require('gulp-watch');
var del = require('del');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var processors = [
	        autoprefixer({browsers: ['last 1 version']}),
	        cssnano()
];

gulp.task('connect-sync', function() {
	  connect.server({}, function (){
		    browserSync({
		      proxy: '127.0.0.1:8000'
		    });
	  });
 
	  gulp.watch('**/*.php').on('change', function () {
	    	browserSync.reload();
	  });
});

gulp.task('minify:php', () => gulp.src('views/*.php', {read: false})
  // .pipe(phpMinify())
  // .pipe(watch('views/*.php'))
  .pipe(gulp.dest('dist/views'))
);

gulp.task('css',function() {
    var processes = [cssnano(),autoprefixer({ add: false, browsers: [] })];

	gulp.src('static/css/*.css')
		// .pipe(ifElse(NODE_ENV === 'public',function() {
  //           return postcss(processes)
  //       }))
        // .pipe(postcss(processes))
        // .pipe(base64({
        //     extensions: ['png', /\.jpg#datauri$/i],
        //     maxImageSize: 10*1024, // bytes,
        //     debug: true
        // }))
        // .pipe(uncss())
	.pipe(gulp.dest('dist/static/css'));

	// gulp.src('static/less/*.less')
	//   .pipe(less({
	//     plugins: [autoprefix]
	//   }))
	//   .pipe(gulp.dest('dist/static/css'));

});

gulp.task('images', function () {
    return gulp.src('static/images/*.*')
            .pipe(imagemin({
                progressive: false
            }))
            .pipe(gulp.dest('dist/static/images'));
});



gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src` 
  return del(['dist']);
});

// 定义 less 任务
gulp.task('lesstask', function() {
   return gulp.src('static/less/*.less')
    .pipe(less({
       plugins: [autoprefix]
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('static/css'))
    .pipe(browserSync.stream());
});

gulp.task('watchchange',['commontask','lesstask'], function() {
   gulp.watch('static/less/*.less',["lesstask"]).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    browserSync.init({
    	startPath : "./",
    	files: ["**","!(node_modules)"],
    	server: {
	      baseDir: "./"
	    },
	    // server: "",
        // proxy: "localhost:9999",    //apache或iis等代理地址
        notify: true,              //刷新是否提示
        open: true                 //是否自动打开页面
    });

    gulp.watch([                    //监听文件变化数组
        '*.php',
        '*.html',
        'static/js/*.js',
        'static/css/*.css',
        'static/less/*.less',
        'static/images/*.*'
        ]).on("change", browserSync.reload);
});


gulp.task('default',['commontask'], function() {

	gulp.src('static/less/*.less')
    .pipe(less({
       plugins: [autoprefix]
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/static/css'));


    
    
});

gulp.task('commontask',['clean','images'], function() {
	  // del(['dist']);
	  gulp.src(['views/*.html'])
	  .pipe(htmlMinify())
	  .pipe(gulp.dest('dist/views'));

	  gulp.src(['*.html'])
	  .pipe(htmlMinify())
	  .pipe(gulp.dest('dist'));

	  gulp.src('views/*.php')
	  .pipe(gulp.dest('dist/views'));

	  gulp.src('*.php')
	  .pipe(gulp.dest('dist'));

	   

	gulp.src('static/css/*.css')
	.pipe(watchs('static/css/*.css'))
	.pipe(postcss(processors))
	.pipe(base64({
        extensions: ['png', /\.jpg#datauri$/i],
        maxImageSize: 10*1024, // bytes,
        debug: true
    }))
	.pipe(gulp.dest('dist/static/css'));

    gulp.src('static/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js'));

    
    
});