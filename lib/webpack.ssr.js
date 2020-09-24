const merge = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base');

const ssrConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'ignore-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'ignore-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: {
            path: 'https://unpkg.com/react@16/umd/react.production.min.js',
            attributes: {
              // integrity: 'sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=',
              crossorigin: 'anonymous',
            },
          },
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: {
            path: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
            attributes: {
              // integrity: 'sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=',
              crossorigin: 'anonymous',
            },
          },
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      minimize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge.default(baseConfig, ssrConfig);
