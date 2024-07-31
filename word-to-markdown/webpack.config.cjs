const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const nodeModulePrefixRe = /^node:/u;

module.exports = {
  entry: ['./src/index.ts'],
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [new TerserPlugin()],
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200000, 
    maxEntrypointSize: 400000, 
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
