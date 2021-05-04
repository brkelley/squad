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
                test: /\.(t|j)sx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\?(t|j)s$/,
                exclude: /node_modules/,
                loader: 'source-map-loader',
                resolve: {
                    fullySpecified: false
                }
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/i,
                type: 'asset'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.ts', '.jsx', '.tsx', '.png'],
        alias: {
            '@': path.resolve(__dirname, ''),
        }
    },
};
