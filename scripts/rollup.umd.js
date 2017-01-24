/*
Build to an Universal Module Definition
*/
import { pkg, createConfig } from "./rollup.base.js";
import uglify from "rollup-plugin-uglify";

const env = process.env; // eslint-disable-line no-undef
const includeDepencies = !!env.DEPS || false; // Use `false` if you are creating a library, or if you are including external script in html
const moduleName = env.MODULE_NAME || "mithril-infinite";

const baseConfig = createConfig({ includeDepencies });
const targetConfig = Object.assign({}, baseConfig, {
  dest: pkg.main,
  format: "umd",
  sourceMap: true,
  moduleName
});

targetConfig.plugins.push(uglify());

export default targetConfig;

