/**
 * Created by sean on 04/02/17.
 */
let BundleTracker = require('webpack-bundle-tracker');
let path = require('path');
let base_config_loader = require('./webpack.base.config.js');

module.exports = (opts) => {
    const {PROJECT_ROOT, NODE_ENV} = opts;
    let base_config = base_config_loader(opts);
    let output_path = path.resolve(PROJECT_ROOT, 'build/');

    return {
        output: [],
        context: PROJECT_ROOT,
        output: {
            path: output_path,
            publicPath: '/static/wp/',
            filename: '[name].js'
        },
        entry: {
            'bootstrap' : [
                'jquery',
                'bootstrap-loader',
                'font-awesome/css/font-awesome.css',
            ]
        },
        // include the loaders from the main file
        module: base_config.module,
        plugins: [
            new BundleTracker({
                path: output_path,
                filename: 'webpack-stats-bootstrap.json'
            })
        ]
    }
}