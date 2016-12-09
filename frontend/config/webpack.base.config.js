var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = (opts) => {
  const {PROJECT_ROOT, NODE_ENV} = opts;

  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new webpack.ProvidePlugin({
        'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    })
  ];

  return {
    context: PROJECT_ROOT,
    entry: {
        main: ['babel-polyfill', './js/index'],
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
            'react-fa',
            'jquery',
            'selectize',
            'selectize/dist/css/selectize.bootstrap3.css'
        ],
        b2MapSelector: './js/location_selector',
        editor: './js/editor'
    },
    output: {
        path: path.resolve(PROJECT_ROOT, './build/'),
        filename: "[name]-[hash].js"
    },
    plugins,
    resolve: {extensions: ['.js']},
    module: {
        loaders: [
            {test: /\.css$/, loaders: ['style-loader', 'css-loader?-autoprefixer', 'postcss-loader']},
            {test: /\.scss$/, loaders: ['style-loader', 'css-loader?-autoprefixer', 'postcss-loader', 'sass-loader']},
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|jpeg)?$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            // jquery + Bootstrap 3
            // if jquery is required, expose globally
            { test: require.resolve("jquery"), loader: "expose-loader?$!expose-loader?jQuery" },
            {
                test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports-loader?jQuery=jquery'
            },
            // everything else
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-2'],
                    cacheDirectory: true
                }
            }
        ],
    }
  };
};
