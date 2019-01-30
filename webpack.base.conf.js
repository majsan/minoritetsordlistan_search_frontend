'use strict'
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    client: './src/main.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // TODO: this might be an issue in prod?
          hotReload: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.css$/,
        loader: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'static',
      to: 'static'
    }]),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new VueLoaderPlugin()
  ]
}
