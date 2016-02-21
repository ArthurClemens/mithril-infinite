'use strict';
var sh = require('shelljs');

var state = process.argv[2]; // 'preflight' or 'postfligh'
var libs = [
    {
        path: '../../../master/',
        name: 'mithril-infinite'
    }
];
var tmpDir = 'tmp/';
var nodeDir = 'node_modules/';

var symlinksToTmp = function() {
    libs.forEach(function(id) {
        sh.mv(nodeDir + id.name, tmpDir + id.name);
    });
};

var copyOrigDirs = function() {
    libs.forEach(function(id) {
        sh.cp('-R', id.path, nodeDir + id.name);
    });
};

var removeCopiedDirs = function() {
    libs.forEach(function(id) {
        sh.rm('-rf', nodeDir + id.name);
    });
};

var tmpToNode = function() {
    libs.forEach(function(id) {
        sh.mv(tmpDir + id.name, nodeDir + id.name);
    });
};

if (state === 'preflight') {
    symlinksToTmp();
    copyOrigDirs();
} else if (state === 'postflight') {
    removeCopiedDirs();
    tmpToNode();
}
