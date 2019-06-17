/* global process */
import fs from "fs";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

const env = process.env;
export const pkg = JSON.parse(fs.readFileSync("./package.json"));
const external = Object.keys(pkg.dependencies || {});
const name = env.MODULE_NAME || "mithrilInfinite";

const globals = {};
external.forEach(ext => {
  switch (ext) {
  default:
    globals[ext] = ext;
  }
});

export const createConfig = () => {
  const config = {
    input: env.ENTRY || "index.js",
    external,
    output: {
      name,
      globals,
    },
    plugins: [

      resolve(),

      commonjs(),

      babel({
        exclude: "node_modules/**",
        configFile: "../../babel.config.js"
      })
    ]
  };
  
  return config;
};
