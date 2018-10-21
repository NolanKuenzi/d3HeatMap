const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin'); 

const paths = {
	DOCS: path.resolve(__dirname, "docs"),
	SRC: path.resolve(__dirname, "src"),
	JS: path.resolve(__dirname, "src/js"),
};

module.exports = {
  entry: path.join(paths.JS, "app.js"),
  output: {
    path: paths.DOCS,
    filename: "app.bundle.js"
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, "index.html"),
    }),
    new ExtractTextPlugin("style.bundle.css"),
  ],
  
  module: {
  	rules: [
      {
      	test: /\.(js)$/,
      	exclude: /node_modules/,
      	use: [
          'babel-loader',
      	],
      },
      
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
        	use: 'css-loader',
        }),
      }
  	],
  },
  
  resolve: {
    extensions: [".js"]
  },
};
