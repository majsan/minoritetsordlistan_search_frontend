'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  devServer: {
    host: '0.0.0.0',
    port: 9000
  },
  devtool: 'inline-source-map',
  mode: 'development'
});
