const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.tsx'),
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
        historyApiFallback: true,
    },
    mode: 'development',
    module: {
        rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
              },
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
                loader: 'url-loader',
                options: {
                    // name: 'public/[name].[ext]',
                    limit: 8000, // Convert images < 8kb to base64 strings
                    // name: 'images/[hash]-[name].[ext]'
                },
                type: 'javascript/auto'
            },
            {
                test: /\.(wasm)$/,
                loader: 'file-loader',
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') }),
        new FaviconsWebpackPlugin({
            logo: './public/duckpuc-logo.svg', // svg works too!
            mode: 'webapp', // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
            devMode: 'webapp', 
            favicons: {
                appName: 'duckpuc',
                appDescription: 'Duckpuc - Fun & Concensual dickpics',
                developerName: 'lizozom',
                developerURL: null, // prevent retrieving from the nearest package.json
                background: '#ddd',
                theme_color: '#333',
                icons: {
                  coast: false,
                  yandex: false
                }
              }
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: { 
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "os": require.resolve("os-browserify/browser"),
        }
    },
};