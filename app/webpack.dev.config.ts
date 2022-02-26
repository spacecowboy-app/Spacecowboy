import { Configuration, EnvironmentPlugin, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const config = {
    mode: "development",
    output: {
        publicPath: "/",
    },
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                        "@babel/preset-env",
                        "@babel/preset-react",
                        "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader" ],
            },
            {
                test: /\.png$/i,
                type: "asset/resource",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: false
        }),
        new ESLintPlugin({
            extensions: ["js", "jsx", "ts", "tsx"],
        }),
        new EnvironmentPlugin({
            SPACECOWBOY_LOGLEVEL: "Debug",
            SPACECOWBOY_API_BASE: "http://localhost:5000",
            SPACECOWBOY_VERSION: "unversioned",
            SPACECOWBOY_ENVIRONMENT: "Development",
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        static: [ "public", "build" ],
        historyApiFallback: true,
        port: 3000,
        open: true,
        hot: true
    },
};

export default config;