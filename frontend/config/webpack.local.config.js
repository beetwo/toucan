import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';

import baseConfig from './webpack.base.config.js';

module.exports = (opts) => {

  const {CDN_PATH, PROJECT_ROOT} = opts,
      config = baseConfig(opts),
      output_path = path.resolve(PROJECT_ROOT, 'build/');

  return {
    ...config,
    output: {
      ...config.output,
      publicPath: '/static/wp/',

    },
    plugins: [
      ...config.plugins,
      // local bundle stats file
      new BundleTracker({
        path: output_path,
        filename: 'webpack-stats-development.json'
      }),
      new webpack.NoErrorsPlugin(),
    ]
  };
};
