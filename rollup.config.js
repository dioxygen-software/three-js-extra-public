import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const NAME = "three-examples"

export default {
    input: "./src/exports.ts",
    plugins: [
        typescript(),
        commonjs(),
        nodeResolve(),
    ],
    external: [
        /node_modules/,
    ],
    output: [
        {
            file: `./dist/${NAME}.module.js`,
            format: "esm",
            sourcemap: true,
        },
    ],
}
