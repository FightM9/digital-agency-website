const { src, dest, watch, series, parallel } = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgsprite = require("gulp-svg-sprite");
const del = require("del");
const sync = require("browser-sync").create();
const concat = require('gulp-concat');


// Styles
const styles = () => {
  return src("source/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(dest("build/css"))
    .pipe(sync.stream());
}
exports.styles = styles;


// Minify HTML
const html = () => {
  return src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("build"));
}


// Minify JS
const scripts = () => {
  return src("source/js/*.js")
    .pipe(sourcemap.init())
    .pipe(concat('scripts.js'))
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(sourcemap.write("."))
    .pipe(dest('build/js'))
    .pipe(sync.stream())
}
exports.scripts = scripts;

const plugins = () => {
  return src("source/js/plugins/*.js")
    .pipe(sourcemap.init())
    .pipe(concat('plugins.js'))
    .pipe(terser())
    .pipe(rename("plugins.min.js"))
    .pipe(sourcemap.write("."))
    .pipe(dest('build/js'))
    .pipe(sync.stream())
}
exports.plugins = plugins;


// Optimization Image, SVG
const images = () => {
  return src("source/img/**/*.{png,jpg}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(dest("build/img"))
}
exports.images = images;


// Create WebP
const createWebp = () => {
  return src("source/img/*.{jpg,png}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(dest("build/img"))
}
exports.createWebp = createWebp;


// SVG sprite
const svgstack = () => {
  return src("source/img/icons/**/*.svg")
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename("stack.svg"))
    .pipe(dest("build/img"));
}
exports.svgstack = svgstack;


// Copy to build
const copy = (done) => {
  src([
    "source/fonts/*.{woff2,woff}",
    "source/img/favicon/favicon*.{svg,ico}",
    "source/img/favicon/*.webmanifest",
    "source/img/**/*.{jpg,png,svg}"
    
  ], {
    base: "source"
  })
    .pipe(dest("build"))
  done();
}
exports.copy = copy;


// Delete build
const clean = () => {
  return del("build");
};


// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
exports.server = server;

const reload = done => {
  sync.reload();
  done();
}


// Watcher
const watcher = () => {
  watch("source/scss/**/*.scss", series(styles));
  watch("source/js/*.js", series(scripts));
  watch("source/*.html", series(html, reload));
}

const build = series(
  clean,
  copy,
  parallel(
    styles,
    html,
    scripts,
    plugins,
    svgstack,
    createWebp
  ),
  series(
    server,
    watcher
  )
);

exports.build = build;

