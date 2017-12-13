const config = require("./webpack.config.js");

const MinifyPlugin = require("babel-minify-webpack-plugin");

config.plugins.push(new MinifyPlugin());

module.exports = config;
