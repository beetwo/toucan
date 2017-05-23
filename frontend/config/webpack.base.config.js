var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = (opts) => {
  const {
      PROJECT_ROOT,
      NODE_ENV,
      STATS_FILE,
      BUILD_ROOT,
      MAPBOX_API_KEY
  } = opts;

  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        MAPBOX_API_KEY: JSON.stringify(MAPBOX_API_KEY)
      },
    }),
    new webpack.ProvidePlugin({
        'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: 2
    }),
    // this should just include the wp boilerplate stuff (approx 30kb)
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: "manifest",
    //     minChunks: Infinity
    // }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true
    }),
    // local bundle stats file
    new BundleTracker({
        path: BUILD_ROOT,
        filename: STATS_FILE
    })
  ];

  let cssLoaders = [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
            autoprefixer: false,
            importLoaders: 1
        },
      },
      'postcss-loader'
  ];

  return {
    context: PROJECT_ROOT,
    entry: {
        main: [
            'babel-polyfill',
            './js/index'
        ],
        vendor: [
            './css/misc.css',
            'react',
            'react-dom',
            'leaflet',
            'react-leaflet',
            'react-markdown',
            'react-router',
            'react-fa',
            'selectize',
            'selectize/dist/css/selectize.bootstrap3.css'
        ],
        b2MapSelector: './js/location_selector',
        editor: './js/editor',
        bootstrap : [
            'jquery',
            'bootstrap-loader',
            'font-awesome/css/font-awesome.css',
        ]
    },
    output: {
        path: BUILD_ROOT,
        publicPath: '/static/wp/'
    },
    plugins,
    resolve: {extensions: ['.js']},
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: cssLoaders
            },
            {
                test: /\.scss$/,
                use: [
                    ...cssLoaders,
                    'sass-loader'
                ]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|jpeg)?$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            // jquery + Bootstrap 3
            // if jquery is required, expose globally
            {
                test: require.resolve("jquery"),
                loader: "expose-loader?$!expose-loader?jQuery"
            },
            {
                test: /bootstrap-sass\/assets\/javascripts\//,
                loader: 'imports-loader?jQuery=jquery'
            },
            // everything else
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-2'],
                    cacheDirectory: true
                }
            }
        ],
    }
  };
};
