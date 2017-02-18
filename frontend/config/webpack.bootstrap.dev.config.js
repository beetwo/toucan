const path = require('path')

let bsConfig = require('./webpack.bootstrap.config')

module.exports = (opts) => {

    let config = bsConfig(opts)
    config.output.publicPath = '/';

    return {
        ...config,
        devServer: {
            port: 9000
        }
    }
}
