// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path')

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {

  const config = genDefaultConfig(baseConfig, env);

  // add typescript loader:
  config.module.rules.push({
    test: /\.tsx?$/,
    include: [/stories/, /src\/components/],
    loader: require.resolve('ts-loader')
  });
  // add styles loader
  config.module.rules.push({
    test: /\.sass$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: [/stories/, /src\/components/]
  });
  // autoprefixer
  config.module.rules.push({
    test: /\.css$/,
    loaders: ["style-loader", "css-loader", "postcss-loader"]
  });

  config.resolve.extensions.push('.ts', '.tsx', '.css', '.sass');

  return config;
};
