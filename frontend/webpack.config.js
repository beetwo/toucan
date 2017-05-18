/**
 * The main webpack configuration.
 *
 * By default webpack commands will look for this file unless the --config [path] argument is used.
 * This config routes to other configs using, process.env.NODE_ENV to determine which config is being requested.
 *
 * Adding more configs:
 *  Just add the NODE_ENV=<config> prefix to your command or export to the environment.
 *  Add a case for your <config> value that returns the path to your config file.
 *
 * @returns {object} - returns a webpack config object
 */

require('dotenv').config()

const path = require('path')

let OPTIONS = {
    PROJECT_ROOT: __dirname,
    BUILD_ROOT: path.resolve(__dirname, 'production/'),
    NODE_ENV: process.env.NODE_ENV,
    CDN_PATH: process.env.CDN_PATH,
    HMR: process.env.HMR,
    STATS_FILE: 'webpack-stats.json',
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY
};

module.exports = (() => {
  let hmr = process.env.BABEL_ENV || false;
  switch (process.env.NODE_ENV) {
    case 'development':
      OPTIONS = {
          ...OPTIONS,
          BUILD_ROOT: path.resolve(__dirname, 'build/')
      }
      if (hmr) {
        return require('./config/webpack.development.hmr.config.js');
      }
      return require('./config/webpack.development.config.js');
    default:
      // default is production config
      return require('./config/webpack.production.config.js');
  }
})()(OPTIONS);
