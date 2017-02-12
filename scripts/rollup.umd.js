/*
Build to an Universal Module Definition
*/
import { pkg, createConfig } from "./rollup.base.js";
import uglify from "rollup-plugin-uglify";

const env = process.env; // eslint-disable-line no-undef
const includeDepencies = !!parseInt(env.DEPS, 10) || false; // Use `false` if you are creating a library, or if you are including external script in html
const dest = env.DEST || pkg.main;

const baseConfig = createConfig({ includeDepencies });
const targetConfig = Object.assign({}, baseConfig, {
  dest,
  format: "umd",
  sourceMap: true
});

targetConfig.plugins.push(uglify());

export default targetConfig;

