const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    main: [
      './src/index.js'
    ],
    'modules/discount-code/index': [
      './src/modules/discount-code/index.js'
    ],
    'modules/discount-redemption-split/index': [
      './src/modules/discount-redemption-split/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            attrs: ['img:src','link:href','image:xlink:href','use:xlink:href'],
            minimize: true
          }
        }]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            esModule: false,
            outputPath: 'img/'
          }
        }]
      }
    ]
  },
  target: 'web',
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html",
      chunks: ['main'],
      excludeChunks: ['server']
    }),
    new HtmlWebPackPlugin({
      template: "./src/modules/discount-code/html/index.html",
      filename: "./modules/discount-code/index.html",
      chunks: ['modules/discount-code/index'],
      excludeChunks: ['server']
    }),
    new HtmlWebPackPlugin({
      template: "./src/modules/discount-redemption-split/html/index.html",
      filename: "./modules/discount-redemption-split/index.html",
      chunks: ['modules/discount-redemption-split/index'],
      excludeChunks: ['server']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}