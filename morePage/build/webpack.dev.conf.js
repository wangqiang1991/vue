var utils = require('./utils')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var page = require('../config/page')
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function resolveApp(relativePath) {
  return path.resolve(relativePath);
}

var pluginsarry = [
   new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new FriendlyErrorsPlugin()
    ];
for (var i in page){
 var HtmlWebpackPlugin1 = new HtmlWebpackPlugin({
      filename: config.build[i],
      template: 'template.html',
      favicon: resolveApp('favicon.ico'),
      inject: true,
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      chunks: [i]
    })
  
 pluginsarry.push(HtmlWebpackPlugin1)

}
//console.log(pluginsarry)

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  // cheap-source-map is faster for development
  devtool: '#cheap-source-map',
  cache: true,
  plugins: pluginsarry
})



// [
//     new webpack.DefinePlugin({
//       'process.env': config.dev.env
//     }),
//     // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin(),
//     // https://github.com/ampedandwired/html-webpack-plugin
//     new FriendlyErrorsPlugin(),

//     new HtmlWebpackPlugin({
//       filename: config.build.home,
//       template: 'template.html',
//       favicon: resolveApp('favicon.ico'),
//       inject: true,
//       path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
//       chunks: ['home']
//     }),

//     new HtmlWebpackPlugin({
//       filename: config.build.class,
//       template: 'template.html',
//       favicon: resolveApp('favicon.ico'),
//       inject: true,
//       path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
//       chunks: ['class']
//     })
    
//   ]
