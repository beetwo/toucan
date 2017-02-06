/**
 * Created by sean on 04/02/17.
 */
let BundleTracker = require('webpack-bundle-tracker');
let path = require('path');
let base_config_loader = require('./webpack.base.config.js');

module.exports = (opts) => {
    const {PROJECT_ROOT, NODE_ENV, BUILD_ROOT} = opts,
        base_config = base_config_loader(opts),
        // bootstrap builds into subdirectory of build root
        output_path = path.resolve(BUILD_ROOT, 'bootstrap/'),
        stats_file='webpack-stats-bootstrap.json';

    return {
        output: [],
        context: PROJECT_ROOT,
        output: {
            path: output_path,
            publicPath: base_config.output.publicPath + 'bootstrap/',
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
                filename: stats_file
            })
        ]
    }
}