// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var page = require('../config/page')

var model = {
    build: {
			sitEnv: require('./sit.env'),
      testEnv: require('./test.env'),
			prodEnv: require('./prod.env'),
			assetsRoot: path.resolve(__dirname, '../dist'),
			assetsSubDirectory: 'static',
			assetsPublicPath: './',          //请根据自己路径配置更改
			productionSourceMap: false,
			// Gzip off by default as many popular static hosts such as
			// Surge or Netlify already gzip all static assets for you.
			// Before setting to `true`, make sure to:
			// npm install --save-dev compression-webpack-plugin
			productionGzip: false,
			productionGzipExtensions: ['js', 'css'],
			// Run the build command with an extra argument to
			// View the bundle analyzer report after build finishes:
			// `npm run build --report`
			// Set to `true` or `false` to always turn it on or off
			bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
			env: require('./dev.env'),
			//port: 80,
			port: 8080,
			autoOpenBrowser: true,
			assetsSubDirectory: 'static',
			assetsPublicPath: '/',
			proxyTable: {
				'/app/api':{
         target:'http://192.168.20.104:8808/',
         //target:'http://47.95.8.35:8808/',
         //target:'https://wx.goochao.com/',
         //target:'http://test.wx.goochao.com/',
         changeOrigin:true
    		},
        '/api/api': {
          target:'http://192.168.20.104:8808/',
          //target:'http://47.95.8.35:8808/',
          //target:'http://test.wx.goochao.com/',
          changeOrigin:true,
          pathRewrite: {
            '^/api/api': '/app/api'      // rewrite paths
          }
        },
        '/editor': {
          target: 'http://192.168.20.102:8089/',
          changeOrigin: true,
          pathRewrite: {
            '^/editor': ''      // rewrite paths
          }
        }
			},
			// CSS Sourcemaps off by default because relative paths are "buggy"
			// with this option, according to the CSS-Loader README
			// (https://github.com/webpack/css-loader#sourcemaps)
			// In our experience, they generally work as expected,
			// just be aware of this issue when enabling this option.
			cssSourceMap: false
    }
};

for (var key in page) {
	model.build[key] = path.resolve(__dirname, page[key].output);
}

//console.log(model);

module.exports = model;
