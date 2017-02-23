const path = require('path')

let bsConfig = require('./webpack.bootstrap.config')

module.exports = (opts) => {
    let config = bsConfig(opts)
    config.output.publicPath = '/';

    // remove plugins as we don't need the BundleTracker
    config.plugins =[];

    return {
        ...config,
        devServer: {
            port: 9000
        }
    }
}
