const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: `${__dirname}/dist`,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
        extensions: ['*', '.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'SERVER_URL': '"https://squad-265800.appspot.com"',
            'ENVIRONMENT': '"dev"'
        }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
        hot: true
    }
};