/* globals process */
/*
Build to a module that has ES2015 module syntax but otherwise only syntax features that node supports
https://github.com/rollup/rollup/wiki/jsnext:main
*/
import { pkg, createConfig } from "./rollup.base.js";

const includeDepencies = !!process.env.DEPS || false; // Use `false` if you are creating a library, or if you are including external script in html

const baseConfig = createConfig({ includeDepencies });
const targetConfig = Object.assign({}, baseConfig, {
  dest: pkg["jsnext:main"],
  format: "es"
});

export default targetConfig;

