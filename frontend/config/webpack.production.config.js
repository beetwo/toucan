import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import ExtractTextPlugin from "extract-text-webpack-plugin";

import baseConfig from './webpack.base.config.js';

module.exports = (opts) => {

  const
    {CDN_PATH, PROJECT_ROOT, STATS_FILE, BUILD_ROOT} = opts,
    config = baseConfig(opts);

  return {
    ...config,
    output: {
      ...config.output,
      filename: "[name]-[chunkhash].js",
      // set CDN_PATH to your cdn static file directory
      publicPath: CDN_PATH || '/static/wp/'
    },
    devtool: 'source-map',
    plugins: [
      ...config.plugins,
      // pass options to uglify
      new webpack.LoaderOptionsPlugin({
       minimize: true,
       debug: false,
      }),
      // minifies your code
      new webpack.optimize.UglifyJsPlugin({
       compress: {
         warnings: false,
       },
       output: {
         comments: false,
       },
       sourceMap: false,
      }),
      // this cleans up the build directory
      new WebpackCleanupPlugin({
        exclude: [
            STATS_FILE,
            'bootstrap/**/*'
        ]
      })
    ],
  };
};
