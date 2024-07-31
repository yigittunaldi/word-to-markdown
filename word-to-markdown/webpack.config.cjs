const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['./src/index.ts'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  stats: {
    errors: true,
    warnings: false,
  },
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
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^node:/u, (resource) => {
      const module = resource.request.replace(/^node:/u, '');
      resource.request = module;
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 1000000,
  },
};
