var config = require('./webpack.config.js');
var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

config.output.path = path.resolve('./production/');
config.output.filename = '[name].js';

config.plugins = [
    new BundleTracker({filename: './webpack-stats-prod.json'}),
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
];

// override any other settings here
// like using Uglify or other things
// that make sense for production environments.
module.exports = config;