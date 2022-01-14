import path from "path";
import { Configuration, EnvironmentPlugin } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";


/** Configuration variables available to this script */
interface Environment {

    /** App version string */
    SPACECOWBOY_VERSION: string|undefined;

}



module.exports = (env: Environment): Configuration => {

    console.log("Configuration:\n", JSON.stringify(env, null, 4))

    return {
        mode: "production",
        entry: "./src/index.tsx",
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].[contenthash].js",
            publicPath: "",
        },
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
                new ForkTsCheckerWebpackPlugin({
                async: false,
            }),
                new ESLintPlugin({
                extensions: ["js", "jsx", "ts", "tsx"],
            }),
            new EnvironmentPlugin({
                SPACECOWBOY_LOGLEVEL: "Warning",
                SPACECOWBOY_API_BASE: "",
                SPACECOWBOY_VERSION: env.SPACECOWBOY_VERSION ?? "development",
                SPACECOWBOY_ENVIRONMENT: "Production",
            }),
            new CopyPlugin({
                patterns: [
                    { from: "public", to: "" },
                ]
            }),
            new CleanWebpackPlugin(),
        ],
    };
};
