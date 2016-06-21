import baseConfig from './webpack.local.config.js';


module.exports = (opts) => {

  let config = baseConfig(opts);

  return {
    ...config,
    devtool: 'source-map',
    output: {
      ...config.output,
      publicPath: 'http://localhost:8080/bundles/'
    }
  };
};
