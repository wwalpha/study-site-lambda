const path = require('path');
const Webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: 'node',
  devtool: 'cheap-module-eval-source-map',
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ]
  },
  externals: ['aws-sdk'],
  resolve: {
    extensions: [
      '.ts', '.js'
    ],
    alias: {
      src: path.resolve(__dirname, '../src/'),
      dynamodb: path.resolve(__dirname, '../src/utils/dynamodb/'),
    },
  },
  plugins: [
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production') // 環境変数はwebpackで展開されるので、ここで設定します
      }
    }),
    new Webpack.LoaderOptionsPlugin({
      // minimize: true,
      debug: false
    })
  ],
  bail: true,
}
