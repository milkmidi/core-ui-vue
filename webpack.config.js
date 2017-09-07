const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueExtractTextURLPlugin = require('./internal/webpack-plugin/vue-extracttext-url-plugin');
const moment = require('moment');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const DEV_MODE = process.env.NODE_ENV === 'development';

const toFilename = (name, ext = 'js') => {
  let filename = `${name}.${ext}`;
  if (!DEV_MODE) {
    filename += (ext === 'css' ? '?[contenthash]' : '?[chunkhash]');
  }
  return filename;
};

const config = {
  context: path.resolve('src'),
  entry: {
    app: ['./js/main.js'],
    vendor: [
      // 'babel-runtime/regenerator',
      // 'es6-promise/auto',
      // './js/util/init',
      'vue',
      'vue-router',
      // 'vuex',
    ],
  },
  devtool: DEV_MODE ? '#cheap-module-eval-source-map' : false,
  output: {
    filename: toFilename('asset/js/[name]'),
    chunkFilename: toFilename('asset/js/[name].chunk'),
    path: path.resolve('dist'),
    publicPath: '',
  },
  resolve: {
    modules: [
      path.resolve('src/js'),
      path.resolve('src/css'),
      path.resolve('src/asset/'),
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    alias: {
      '~': path.resolve('./src'),
      '@': path.resolve('./src/js'),
      img: path.resolve('./src/asset/img'),
    },
    extensions: ['.js', '.vue'],
  },
};

config.module = {
  rules: [
    {
      test: /\.vue$/,
      use: {
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          extractCSS: !DEV_MODE, // easy way, will auto import postcss.config.js
          // stylus: 'stylus-loader?paths=src/css/',
          scss: 'css-loader?sourceMap!sass-loader?sourceMap=true',
        },
      },
      include: path.resolve('src'),
      exclude: /node_modules/,
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
    },
    {
      test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:7].[ext]',
          // publicPath: '../../',
          outputPath: 'fonts/',
        },
      },
    },
    {
      test: /\.js$/,
      use: 'babel-loader',
      include: path.resolve('src/js'),
      exclude: /node_modules/,
    },
    {
      test: /\.(png|jpg|gif|svg|ico)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[path][name].[ext]?[hash:8]',
        },
      },
      include: path.resolve('src/asset'),
      exclude: /node_modules/,
    },
    {
      test: /\.pug$/,
      use: {
        loader: 'pug-loader',
        options: {
          self: true,
          pretty: DEV_MODE,
        },
      },
    },
  ],
};


config.plugins = [
  new HtmlWebpackPlugin({
    template: './html/index.template.pug',
    data: {
      DEV_MODE,
      dateTime: moment().format('YYYY_MM_DD_hh_mm'),
    },
  }),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),
  new ExtractTextPlugin({
    filename: toFilename('asset/css/[name]', 'css'),
    disable: DEV_MODE,
  }),
  new VueExtractTextURLPlugin({ disable: DEV_MODE }),
  new CopyWebpackPlugin([
    { from: 'asset/copy', to: './' },
  ]),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(DEV_MODE ? 'development' : 'production'),
    },
  }),

  ...DEV_MODE ? [
    new FriendlyErrorsPlugin(),
  ] : [
    new CleanWebpackPlugin('./dist'),
  ],
];

config.performance = {
  maxEntrypointSize: 300000,
  hints: !DEV_MODE ? 'warning' : false,
};


config.devServer = {
  historyApiFallback: true,
  noInfo: true,
  hot: true,
  port: 3000,
  stats: {
    colors: true,
    hash: false,
    chunks: false,
  },
  host: '0.0.0.0',
  disableHostCheck: true,
  proxy: {
    // '/api': 'http://localhost:3000',
  },
};
module.exports = config;
