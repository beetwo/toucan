var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,
    entry: {
        main: './js/index',
        bootstrap: [
            'bootstrap-loader',
            './css/misc.css'
        ]
    },
    output: {
        path: path.resolve('./build/'),
        publicPath: "/static/wp/",
        filename: "[name]-[hash].js"
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
    resolve: {extensions: ['', '.js']},
    module: {
        loaders: [
            {test: /\.css$/, loaders: ['style', 'css']},
            {test: /\.scss$/, loaders: ['style', 'css','sass']},
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },

            // Use one of these to serve jQuery for Bootstrap scripts
            // Bootstrap 4
            // { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },

            // Bootstrap 3
            {test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery'},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015', 'stage-2']
                }
            }
        ],
    },
}
