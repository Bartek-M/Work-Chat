const path = require("path");
const webpack = require("webpack")

module.exports = {
    entry: {
        home: "./src/home.ts",
        app: "./src/app/index.ts",
        login: "./src/auth/login.ts",
        register: "./src/auth/register.ts",
    },
    output: {
        path: path.resolve(__dirname, "./assets/js"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts"],
        modules: ["node_modules"]
    },
    module: {
        rules: [{ 
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    optimization: { minimize: true },
    devtool: "eval-cheap-source-map"
}