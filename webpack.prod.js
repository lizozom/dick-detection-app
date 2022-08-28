const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
   optimization: {
    mangleWasmImports: true,
    minimize: true,
   },
 });