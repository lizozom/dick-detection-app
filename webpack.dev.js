const path = require('path');
const fs = require('fs');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        allowedHosts: [
            'all'
        ],
        https: {
            key: fs.readFileSync("keys/cert.key"),
            cert: fs.readFileSync("keys/cert.crt"),
            ca: fs.readFileSync("keys/ca.crt"),
        },

        static: {
            directory: path.join(__dirname, 'public'),
        },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
        historyApiFallback: true,
    },
});
