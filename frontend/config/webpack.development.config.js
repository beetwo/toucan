import path from "path";
import webpack from "webpack";
import BundleTracker from "webpack-bundle-tracker";

import baseConfig from "./webpack.base.config.js";

module.exports = opts => {
  const config = baseConfig(opts);

  return {
    ...config,
    cache: true,
    // devtool: "source-map",
    devtool: "cheap-eval-source-map",
    output: {
      ...config.output,
      publicPath: "/static/wp/",
      filename: "[name].js"
    },
    plugins: [...config.plugins, new webpack.NoEmitOnErrorsPlugin()],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  };
};
