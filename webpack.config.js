const path = require("path");
const webpack = require("webpack")

module.exports = {
    entry: {
        main: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "./assets/js"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts"],
    },
    module: {
        rules: [{ loader: "ts-loader" }]
    },
    optimization: { minimize: true },
    devtool: "eval-cheap-source-map"
}