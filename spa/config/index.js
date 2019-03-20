// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    sitEnv: require('./sit.env'),
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
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
    port: 8099,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target:'http://192.168.20.104:8888/',
        //target: 'http://192.168.0.107:8888/',
        //target: 'https://admin.goochao.com/',
        //target:'http://47.95.8.35:8888/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/editor': {
        target: 'http://192.168.20.102:8089/',
        //target: 'http://localhost:8089/',
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
}
