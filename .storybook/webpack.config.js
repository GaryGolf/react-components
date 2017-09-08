// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const sourcePath = path.join(__dirname, '../src')
const PRODUCTION = process.argv.indexOf('-p') >= 0
const outPath = PRODUCTION ? path.join(__dirname, '../api/webroot') : path.join(__dirname, '../dist')


module.exports = {
  plugins: [
    // your custom plugins
    new webpack.LoaderOptionsPlugin({
      options: {
        context: sourcePath,
        postcss: [
          require('postcss-smart-import')({ addDependencyTo: webpack }),
          require('postcss-cssnext')(),
          require('postcss-reporter')(),
          require('postcss-browser-reporter')({ disabled: PRODUCTION }),
        ]
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development')
      }
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !PRODUCTION
    })
  ],
  module: {
    rules: [
      // add your custom rules.
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: [/stories/, /components/],
        loader: "ts-loader"
      },
       // css 
       {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !PRODUCTION,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      // static assets 
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=10000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ],
  },
};
