const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const paths = require('./paths');

const env = dotenv.config({ path: '../config.env' }).parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(env[key]);
    return prev;
}, {});

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: `${__dirname}/dist`,
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'source-map-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(css|scss)$/,
                include: [path.resolve(paths.appSrc)],
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, ''),
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(envKeys),
        new webpack.DefinePlugin({
            'SERVER_URL': '"http://localhost:4444"',
            'ENVIRONMENT': '"dev"'
        }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
        hot: true
    }
};