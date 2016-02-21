'use strict';
var sh = require('shelljs');

var state = process.argv[2]; // 'preflight' or 'postflight'
var libs = ['mithril-infinite'];
var tmpDir = 'tmp/';
var npmTmpDir = 'tmp-npm/';
var nodeDir = 'node_modules/';

var symlinksToTmp = function() {
    libs.forEach(function(id) {
        sh.mv(nodeDir + id, tmpDir + id);
    });
};

var npmToNode = function() {
    libs.forEach(function(id) {
        sh.mv(npmTmpDir + id, nodeDir + id);
    });
};

var nodeToNpmTmp = function() {
    libs.forEach(function(id) {
        sh.mv(nodeDir + id, npmTmpDir + id);
    });
};

var tmpToNode = function() {
    libs.forEach(function(id) {
        sh.mv(tmpDir + id, nodeDir + id);
    });
};

if (state === 'preflight') {
    symlinksToTmp();
    npmToNode();
} else if (state === 'postflight') {
    nodeToNpmTmp();
    tmpToNode();
}
