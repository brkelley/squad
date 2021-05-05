const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv');

const env = dotenv.config({ path: '../config.env' }).parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(env[key]);
    return prev;
}, {});

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(envKeys),
        new webpack.DefinePlugin({
            'SERVER_URL': '"http://squad.rip"',
            'ENVIRONMENT': '"production"'
        }),
    ],
});
