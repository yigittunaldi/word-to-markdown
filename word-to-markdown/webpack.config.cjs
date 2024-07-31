const webpack = require('webpack');
const nodeModulePrefixRe = /^node:/u;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  stats: {
    warnings: true,
    errors: true,
    modules: false,
    performance: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};


module.exports = {
  entry: ['./src/index.ts'],
  stats: { warnings: false },
  module: {
    unknownContextCritical: false,
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: './dist',
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      './main.js': './main.ts',
    },
    fallback: {
      fs: false,
      os: false,
      path: false,
      util: false,
      url: require.resolve('url/'),
    },
  },
  mode: 'production',
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      nodeModulePrefixRe,
      (resource) => {
        const module = resource.request.replace(nodeModulePrefixRe, '');
        resource.request = module;
      },
    ),
  ],
};
