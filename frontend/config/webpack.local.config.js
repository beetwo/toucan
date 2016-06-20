import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';

import baseConfig from './webpack.base.config.js';

module.exports = (opts) => {

  const {CDN_PATH, PROJECT_ROOT} = opts,
      config = baseConfig(opts);
  console.log(config);
  return {
    ...config,
    output: {
      ...config.output,
      publicPath: 'http://localhost:8080/bundles/',
    },
    plugins: [
      ...config.plugins,
      // local bundle stats file
      new BundleTracker({
        path: PROJECT_ROOT,
        filename: 'webpack-stats-development.json'
      }),
      new webpack.NoErrorsPlugin(),
    ]
  };
};
