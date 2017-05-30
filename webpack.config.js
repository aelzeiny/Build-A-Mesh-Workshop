const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./nav_driver.js",
  output: {
    path: path.join(__dirname),
    filename: "bundle.js",
  },
  devtool: "source-maps"
};
