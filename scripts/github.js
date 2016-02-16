var sh = require('shelljs');
sh.rm('-rf', '../gh-pages/*');
sh.cp('-r', 'examples/build/', '../gh-pages/');
