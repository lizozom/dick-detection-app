const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    externals: {
        fs: 'empty',
    },
    externals: ['worker_threads','ws','perf_hooks', 'fs'], // exclude nodejs
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    mode: 'development',
    module: {
        rules: [
            {
                include: [path.join(__dirname)],
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader',
                options: {
                    name: 'public/[name].[ext]'
                }  
            },
            {
                test: /\.(wasm)$/,
                loader: 'file-loader',
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') })],
    resolve: {
        fallback: { 
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "os": require.resolve("os-browserify/browser"),
        }
    },
};