const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const appName = 'Duckpuc';
const duckpuckDescription = 'Duckpuc - Fun & Concensual dickpics';

module.exports = {
    entry: path.resolve(__dirname, 'index.tsx'),
    performance: { hints: false },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    externals: {
        fs: 'empty',
    },
    externals: ['worker_threads', 'ws', 'perf_hooks', 'fs'], // exclude nodejs
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
              test: /\.html$/i,
              loader: "html-loader",
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
                test: /\.svg$/i,
                type: 'asset/inline',
                generator: {
                    dataUrl: content => {
                      content = content.toString();
                      return svgToMiniDataURI(content);
                    }
                  },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(wasm)$/,
                loader: 'file-loader',
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: 'public/', 
                    from: 'banners/*'
                },{
                    context: 'public/',
                    from: 'duckpuc*.(data|wasm|js)'
                },
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            meta: {
                viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',
                'description': duckpuckDescription,
                'keyword': 'duckpuc, dickpic, dick, penis, photo, fun, Consensual, conscent',
                'og:title': appName,
                'og:description': { property: 'og:description', content: duckpuckDescription },
                'og:type': { property: 'og:type', content: 'article' },
                'og:url': { property: 'og:url', content: 'https://duckpuc.com/' },
                'og:image': { property: 'og:image', content: 'https://duckpuc.com/duckpuc-og-banner.jpg', itemprop: "image" },
                'og:locale': { property: 'og:locale', content: "en_US"},
                'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
                'twitter:title': { name: 'twitter:title', content: appName },
                'twitter:description': { name: 'twitter:description', content: duckpuckDescription },
                'twitter:image': { name: 'twitter:image', content: 'https://duckpuc.com/duckpuc-twitter-banner.jpg' }
            }
        }),
        new FaviconsWebpackPlugin({
            logo: './public/duckpuc-logo.svg', // svg works too!
            mode: 'webapp', // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
            devMode: 'webapp',
            favicons: {
                appName: 'duckpuc',
                appDescription: duckpuckDescription,
                developerName: 'lizozom',
                developerURL: null, // prevent retrieving from the nearest package.json
                background: '#feece0',
                theme_color: '#feece0',
                display: 'fullscreen',
                orientation: 'portrait',
                icons: {
                    coast: false,
                    yandex: false
                }
            }
        }),
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