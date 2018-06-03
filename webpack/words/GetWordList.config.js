const baseConfig = require('../webpack.config');
const merge = require('webpack-merge');
const path = require('path');

const getWordList = {
  entry: './src/words/GetWordList.ts',
  output: {
    filename: 'GetWordList.js',
    path: path.resolve(__dirname, '../../build/words'),
  }
}

const merged = merge(baseConfig, getWordList);

module.exports = merged;