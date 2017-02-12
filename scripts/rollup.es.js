/* globals process */
/*
Build to a module that has ES2015 module syntax but otherwise only syntax features that node supports
https://github.com/rollup/rollup/wiki/jsnext:main
*/
import { pkg, createConfig } from "./rollup.base.js";

const includeDepencies = !!parseInt(process.env.DEPS, 10) || false; // Use `false` if you are creating a library, or if you are including external script in html
const env = process.env; // eslint-disable-line no-undef
const dest = env.DEST || pkg.module;

const baseConfig = createConfig({ includeDepencies });
const targetConfig = Object.assign({}, baseConfig, {
  dest,
  format: "es"
});

export default targetConfig;

