var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,
    devtool: 'source-map',
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
                test: /\.(png|jpg|jpeg)?$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.json$/,
                loader: 'json'
            },

            // jquery + Bootstrap 3
            // if jquery is required, expose globally
            { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            {
                test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery'
            },
            // everything else
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
