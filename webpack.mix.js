let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.autoload({
    'jquery': ['jQuery', '$'],
})

mix.styles([
    'public/vendor/blueimp/blueimp-gallery-indicator.css',
    'public/vendor/blueimp/blueimp-gallery.min.css',
    'public/vendor/bootstrap/bootstrap.min.css',
    'public/vendor/font-awesome-4.7.0/css/font-awesome.min.css'
], 'public/css/all-vendor.css');


mix.js([
    'public/vendor/jquery/jquery.min.js',
    'public/vendor/jquery/jquery-fileupload-ui.js',
    'public/vendor/jquery/jquery-fileupload.js',
    'public/vendor/jquery/circle-progress.min.js',
    'public/vendor/jquery/jquery-blueimp-gallery.min.js',
    'public/vendor/masonry/masonry.pkgd.min.js',
    'public/vendor/masonry/imageLoaded.js'
], 'public/js/all-vendor.js');




