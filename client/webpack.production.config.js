const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const dotenv = require('dotenv');

const env = dotenv.config({ path: '../config.env' }).parsed;
  
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(env[key]);
    return prev;
}, {});

module.exports = env => {
    // const envKeys = Object.keys(env).reduce((prev, key) => {
    //     prev[`process.env.${key}`] = JSON.stringify(env[key]);
    //     return prev;
    // }, {});
    return {
        entry: './src/index.jsx',
        output: {
            path: `${__dirname}/dist`,
            publicPath: '/',
            filename: 'bundle.js'
        },
        module: {
            rules:[
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
        externals: {
            serverUrl: ''
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.tsx'],
            alias: {
                '@': path.resolve(__dirname, ''),
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin(envKeys),
            new webpack.DefinePlugin({
                'SERVER_URL': '""',
                'ENVIRONMENT': '"production"'
            }),
        ],
    };
};
