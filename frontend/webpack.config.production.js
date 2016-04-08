var config = require('./webpack.config.js');
var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

delete config.devtool;
config.output.path = path.resolve('./production/');
config.output.filename = '[name].js';

config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new BundleTracker({filename: './webpack-stats-prod.json'}),
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
];

// override any other settings here
// like using Uglify or other things
// that make sense for production environments.
module.exports = config;
