import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "./src/exports.js",
    plugins: [
        commonjs(),
        nodeResolve(),
    ],
    external: [/node_modules/],
    output: [
        {
            dir: './dist',
            format: "esm",
        },
    ],
}