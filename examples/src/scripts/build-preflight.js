'use strict';
var sh = require('shelljs');

// move symlinked working dirs to tmp folder
var workingDirs = ['node_modules/mithril-infinite'];
var workingDest = 'tmp/';

workingDirs.forEach(function(dir) {
    sh.mv(dir, workingDest);
});

// move released dirs to build location folder
var releasedDirs = ['tmp-npm/mithril-infinite'];
var releasedDest = 'node_modules/';

releasedDirs.forEach(function(dir) {
    sh.mv(dir, releasedDest);
});
