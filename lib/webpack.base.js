const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd();
console.log('projectRoot', projectRoot);

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, 'src/*/index.js'));
  Object.values(entryFiles).forEach((val) => {
    const filename = val.match(/\/src\/([a-zA-Z0-9]*)\/index.js/)[1];
    entry[filename] = val;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(projectRoot, `src/${filename}/index.html`),
      scriptLoading: 'defer',
      chunks: [filename],
      filename: `${filename}.html`,
      minifyJS: true,
      minifyCSS: true,
    }));
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const {
  entry,
  htmlWebpackPlugins,
} = setMPA();

module.exports = {
  entry,
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(projectRoot, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // https://github.com/postcss/autoprefixer
                    'autoprefixer',
                  ],
                ],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              // 1 rem = 75 px;
              remUni: 75,
              remPrecision: 8,
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|gif|svg|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name][hash:8].[ext]',
          },
        }],
      },
      {
        test: /\.(TTF|woff|woff2|otf|eot)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 102400,
          },
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
      // chunkFilename: '[id].css',
    }),
    new FriendlyErrorsWebpackPlugin(),
    function ErrorPlungin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors
          && stats.compilation.errors.length
          && !process.argv.includes('--watch')
        ) {
          console.log('build error');
          process.exit(1);
        }
      });
    },
  ],
  stats: 'errors-only',
};
