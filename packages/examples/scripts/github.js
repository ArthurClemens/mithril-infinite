const shell = require("shelljs");

const githubPath = "../../../gh-pages/";

shell.rm("-rf", `${githubPath}*`);
shell.cp("-R", "dist/*", githubPath);