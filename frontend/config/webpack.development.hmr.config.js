import baseConfig from "./webpack.development.config.js";

module.exports = opts => {
  let config = baseConfig(opts);
  return {
    ...config,
    output: {
      ...config.output,
      publicPath: "http://127.0.0.1:8080/bundles/"
    }
  };
};
