const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressPlugin = require("compress-webpack-plugin");
const ASSETS_PATH = './assets';
const BUILD_DIR = path.resolve(__dirname, 'build/');

var webpack_config = {

    context: path.resolve(__dirname, ASSETS_PATH),

    entry: {
        main: [
            "promise-polyfill",
            "object-polyfills",
            "isomorphic-fetch",
            "core-js",
            "es7-object-polyfill",
            "react-native-polyfill",
            "babel-polyfill",
            "react",
            "react-dom",
            "react-props",
            "redux",
            "react-redux",
            "redux-thunk",
            "react-router",
            "react-native-web"
        ],
        app1       : "./js/app1/index.js",
        app2       : "./js/app2/index.jsx",

    },

    output: {
        filename: ("production" === process.env.NODE_ENV) ? 'js/[name]-[chunkhash].min.js' : 'js/[name].min.js',
        publicPath: '/build',
        path: BUILD_DIR
    },

    resolve: {
        extensions: [' ', '.web.js', '.js', '.jsx', 'css'],
        alias: {
            '@expo/vector-icons': 'expo-web',
            'expo': 'expo-web',
            'react-native': 'react-native-web',
        },
    },

    devtool: ("production" === process.env.NODE_ENV) ? "source-map" : "eval-source-map",

    watchOptions: {
        poll: true
    },

    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                loader: 'babel-loader?compact=true&comments=true&minified=true',
                query: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/react',
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ],
                    babelrc: false,
                },
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                include: [
                    /node_modules\/react-router-native/,
                ],
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: [
                        '@babel/preset-env',
                        '@babel/react',
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ],
                    babelrc: false,
                }
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/fonts/'
                    }
                }
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$/,
                exclude: /node_modules/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 1024 * 10,
                        name: '[name].[ext]',
                        outputPath: '/images/'
                    }
                }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader"
                    }
                })
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new CleanWebpackPlugin(
            [BUILD_DIR]
        ),
        new HtmlWebpackPlugin({
            title: ' app1 | title ',
            template: './templates/app1.html',
            filename: '../../templates/app1.html',
            chunks: ['main', 'app1']
        }),
        new HtmlWebpackPlugin({
            title: ' app2 | title ',
            template: './templates/app2.html',
            filename: '../../templates/app2.html',
            chunks: ['main', 'app2']
        }),
        new CopyWebpackPlugin([
            {
                from: './images/favicon',
                to: './images/favicon',
                toType: 'dir'
            }
        ]),
        new ExtractTextPlugin({
            filename: ("production" === process.env.NODE_ENV) ? 'css/style-[chunkhash].min.css' : 'css/style.min.css',
            disable: false,
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: {removeAll: true}},
            canPrint: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["main"]
        }),
        new webpack.optimize.UglifyJsPlugin({
            cache: false,
            minimize: true,
            sourceMap: false,
            beautify: false,
            comments: false,
            compress: {
                warnings: false
            }
        })
        // new CompressionPlugin({
        // 	asset: "[path].gz[query]",
        // 	algorithm: "gzip",
        // 	test: /\.js$|\.html$/,
        // 	threshold: 10240,
        // 	minRatio: 0.8
        // })
    ]
};

module.exports = webpack_config;
