var path = require('path');
var cooking = require('cooking');

cooking.set({
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  dist: './dist',
  template: './index.tpl',

  devServer: {
    port: 8808,
    publicPath: '/'
    // proxy: {
    //     '/proxy/*': {
    //     target: 'http://bbs.ngacn.cc/thread.php?fid=-7&page=1&lite=js',
    //     pathRewrite: {'^/proxy/(.*)$' : ''},
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
  // production
  clean: true,
  hash: true,
  sourceMap: true,
  minimize: true,
  chunk: true, // see https://cookingjs.github.io/zh-cn/configuration.html#chunk
  postcss: [
    // require('...')
  ],
  publicPath: 'dist/',
  assetsPath: 'static',
  urlLoaderLimit: 10000,
  extractCSS: '[name].[contenthash:7].css',
  alias: {
    'src': path.join(__dirname, 'src')
  },
  extends: ['vue2', 'autoprefixer']
});

module.exports = cooking.resolve();
