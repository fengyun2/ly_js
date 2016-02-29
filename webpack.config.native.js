var webpack = require('webpack');

// 独立打包模块
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// 提取多个页面之间的公共模块，并将该模块打包为 common.js
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
  entry: {
    basejs: './src/js/base.js',
    store: './src/js/store.js',
    utils: './src/js/utils.js',
    basecss: ['./src/css/reset.css','./src/css/base.css','./src/css/table.css','./src/css/form.css','./src/css/buttons.css','./src/css/page.css']

    // app: ['./b.js']
    //app: ['webpack/hot/dev-server', './b.js']
  },
  output: {
    path: './dist/',
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      // { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader","autoprefixer-loader")},
      { test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.(png|jpg|gif)$/,loader: 'url-loader?limit=10000'},
    ]
  },
  devtool: 'source-map',
  resolve:{
    extensions:['','.js','.json']
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("css/styles.css"),
    // new ExtractTextPlugin("css/[name].css"),
    new webpack.optimize.CommonsChunkPlugin('js/common.js'),
    // new CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
    // new CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
  ]
};
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ];
} else {
  module.exports.devtool = '#source-map';
}
