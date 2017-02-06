const sh = require("shelljs");

const env = process.env; // eslint-disable-line no-undef
const pkg = env.PACKAGE;

sh.rm("-rf", `node_modules/${pkg}`);
sh.cp("-R", `../${pkg}`, "node_modules/");
sh.rm("-rf", `node_modules/${pkg}/node_modules`);
