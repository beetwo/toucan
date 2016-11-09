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

const OPTIONS = {
  PROJECT_ROOT: __dirname,
  NODE_ENV: process.env.NODE_ENV,
  CDN_PATH: process.env.CDN_PATH,
  HMR: process.env.HMR
};

module.exports = (() => {
  let hmr = process.env.BABEL_ENV || false;
  switch (process.env.NODE_ENV) {
    case 'production':
      return require('./config/webpack.production.config.js');
    case 'development':
      if (hmr) {
        return require('./config/webpack.development.hmr.config.js');
      }
      return require('./config/webpack.development.config.js');
    default:
      return require('./config/webpack.development.config.js');
  }
})()(OPTIONS);
