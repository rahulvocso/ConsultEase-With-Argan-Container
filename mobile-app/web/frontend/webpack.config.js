const path = require('path');
const {DefinePlugin} = require('webpack'); //FOR: VM2005:2 Uncaught ReferenceError: process is not defined
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.html', '.jsx', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['ts-loader'],
        //exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'},
    ],
    loaders: [{test: /\.css$/, loader: 'style-loader!css-loader'}],
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/StartCameraHTML.html',
        filename: 'index.html',
      }),
      new DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
  },
};

// module.exports = {
//   entry: './index.js', //'./src/index.ts',
//   output: {
//     filename: 'bundle.js',
//     path: __dirname + '/dist',
//   },
//   resolve: {
//     extensions: ['.ts', '.js', '.html', 'jsx', 'tsx'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.html$/,
//         use: 'html-loader',
//       },
//     ],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/StartCameraHTML.html',
//       filename: 'index.html',
//     }),
//   ],
// };
