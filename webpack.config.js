// var fs = require('fs');
//先清空 n-dist 文件夹下的文件
var fs = require('fs'),buildPath='./dist/';
var folder_exists = fs.existsSync(buildPath);
if(folder_exists == true)
{
   var dirList = fs.readdirSync(buildPath);
   dirList.forEach(function(fileName)
   {
       fs.unlinkSync(buildPath + fileName);
   });
   console.log("clearing " + buildPath);
};

//readfile
//先把index.html里面关于style和js的hash值都删除掉，避免在使用 npm run dev 的时候，路径还是压缩后的路劲
/*fs.readFile("index.html",'utf-8',function(err,data){
    if(err){
        console.log("error");
    }else{
      //将index.html里面的hash值清除掉
      var devhtml = data.replace(/((?:href|src)="[^"]+\.)(\w{20}\.)(js|css)/g, '$1$3');
      fs.writeFileSync('index.html', devhtml);
    }
});*/

var webpack = require('webpack');
//混淆压缩
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// 独立样式文件,独立打包模块
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 检测重用模块,提取多个页面之间的公共模块，并将该模块打包为 common.js
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");


// 在命令行 输入  “PRODUCTION=1 webpack --progress” 就会打包压缩，并且注入md5戳 到 d.html里面
var production = process.env.PRODUCTION;


var plugins = [
  //会将所有的样式文件打包成一个单独的style.css
  new ExtractTextPlugin( production ? "style.[hash].css" : "style.css" , {
    disable: false//,
    //allChunks: true  //所有独立样式打包成一个css文件
  }),
  //new ExtractTextPlugin("[name].css" )
  //自动分析重用的模块并且打包成单独的文件
  new CommonsChunkPlugin(production ? "common.[hash].js" : "common.js" ),
  function(){
      return this.plugin('done', function(stats) {
        var content;
        //这里可以拿到hash值   参考：http://webpack.github.io/docs/long-term-caching.html
        content = JSON.stringify(stats.toJson().assetsByChunkName, null, 2);
        console.log('版本是：'+JSON.stringify(stats.toJson().hash));
        return fs.writeFileSync('dist/assets.json', content);
      });
  }
];

//发布编译时，压缩，版本控制
if (process.env.PRODUCTION) {
  //压缩
  plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false } }));
}


/*
  版本控制
  package.json中的
    "html-webpack-plugin": "^1.6.2",
  模块是把生成的带有md5戳的文件，插入到index.html中。
  通过index.tpl模板，生成 index.html
 */
var HtmlWebpackPlugin = require("html-webpack-plugin");
//HtmlWebpackPlugin文档 https://www.npmjs.com/package/html-webpack-plugin
//https://github.com/ampedandwired/html-webpack-plugin/issues/52
plugins.push( new HtmlWebpackPlugin({
  filename:'../index.html',//会生成d.html在根目录下,并注入脚本
  template:'index.tpl',
  inject:true //此参数必须加上，不加不注入
}));


module.exports = {
    // entry: ["./src/app.js"],
    entry: {
      // basejs: './src/js/base.js',
      // store: './src/js/store.js',
      // utils: './src/js/utils.js',
      basecss: ['./src/css/reset.css','./src/css/base.css','./src/css/table.css','./src/css/form.css','./src/css/buttons.css','./src/css/page.css']

      // app: ['./b.js']
      //app: ['webpack/hot/dev-server', './b.js']
    },
    output: {
        path: "./dist",
        /*
                publicPath路径就是你发布之后的路径，
                比如你想发布到你站点的/util/vue/dist 目录下, 那么设置
                publicPath: "/util/vue/dist/",
                此字段配置如果不正确，发布后资源定位不对，比如：css里面的精灵图路径错误
         */
        publicPath: "/dist/",
        filename: production ? "dist.[hash].js" : "dist.js"//"dist.[hash].js"//[hash]MD5戳   解决html的资源的定位可以使用 webpack提供的HtmlWebpackPlugin插件来解决这个问题  见：http://segmentfault.com/a/1190000003499526 资源路径切换
    },
    module: {
        preLoaders:[
            // {
            //     //代码检查
            //     test:/\.js$/,exclude:/node_modules/,loader:'jshint-loader'
            // }
        ],
        loaders: [
            // 加载vue组件，并将css全部整合到一个style.css里面
            // 但是使用这种方式后 原先可以在vue组件中 在style里面加入 scoped 就不能用了,
            // 好处是使用了cssnext，那么样式按照标准的来写就行了，会自动生成兼容代码 http://cssnext.io/playground/
            {test: /\.vue$/,
              loader: 'vue'
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!cssnext-loader!autoprefixer-loader")},
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'}, // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            {test: /\.woff$/,   loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf$/,    loader: "file"},
            {test: /\.eot$/,    loader: "file"},
            {test: /\.svg$/,    loader: "file"}
       ]
    },
    vue:{
      css:ExtractTextPlugin.extract("style-loader",
                  "css-loader?sourceMap!cssnext-loader")

    },
    plugins : plugins,
    devtool: 'source-map'//,
    // resolve: {
    //     // 现在可以写 require('file') 代替 require('file.coffee')
    //     extensions: ['', '.js', '.json', '.coffee','vue']
    // }
};


/*

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
      {test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony'},
      // { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader","autoprefixer-loader")},
      { test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.(png|jpg|gif)$/,loader: 'url-loader?limit=10000'},
    ]
  },
  devtool: 'source-map',
  resolve:{
    extensions:['','.js','.json','jsx']
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
*/
