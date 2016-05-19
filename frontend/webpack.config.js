var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    context: __dirname,
    devtool: 'eval-cheap-module-source-map',
    entry: {
        main: './js/index',
        vendor: [
            'bootstrap-loader',
            'font-awesome/css/font-awesome.css',
            './css/misc.css',
            'react',
            'react-dom',
            'leaflet',
            'react-leaflet',
            'react-markdown',
            'react-router',
            'react-fa'
        ],
        b2MapSelector: './js/location_selector'
    },
    output: {
        path: path.resolve('./build/'),
        publicPath: "/static/wp/",
        filename: "[name].js"
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ],
    resolve: {extensions: ['', '.js']},
    module: {
        loaders: [
            {test: /\.css$/, loaders: ['style', 'css', 'postcss']},
            {test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass']},
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file'
            },
            {
                test: /\.(png|jpg|jpeg)?$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.json$/,
                loader: 'json'
            },

            // jquery + Bootstrap 3
            // if jquery is required, expose globally
            { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            {
                test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery'
            },
            // everything else
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015', 'stage-2'],
                    cacheDirectory: true
                }
            }
        ],
    },
    postcss: function () {
      return [precss, autoprefixer];
    }
}
