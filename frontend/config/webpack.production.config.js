import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';
import baseConfig from './webpack.base.config.js';

import WebpackCleanupPlugin from 'webpack-cleanup-plugin';

module.exports = (opts) => {

  const
    {CDN_PATH, PROJECT_ROOT} = opts,
    config = baseConfig(opts);

  return {
    ...config,
    output: {
      ...config.output,
      path: path.resolve(PROJECT_ROOT, 'production/'),
      // set CDN_PATH to your cdn static file directory
      publicPath: CDN_PATH || '/_static/wp/',
    },
    plugins: [
      ...config.plugins,
      // production bundle stats file
      new BundleTracker({
        path: PROJECT_ROOT,
        filename: 'webpack-stats-production.json'
      }),
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
      // removes duplicate modules
      new webpack.optimize.DedupePlugin(),
      new WebpackCleanupPlugin()
    ],
  };
};
