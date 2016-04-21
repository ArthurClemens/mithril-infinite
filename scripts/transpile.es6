'use strict';

// argv[2]: state (run once or watch)
// argv[3]: which dir to watch
// argv[4]: which dir to ignore

const path = require('path');

const watch = require('transpile-watch');
watch ({
    persistent: !(process.argv[2] === 'once'),
    what: process.argv[3],
    ignore: (process.argv[4] && process.argv[4] !== 'null') ? process.argv[4] : null,
    extension: 'es6',
    createOutPath: function(inPath) {
        return inPath.replace(/es6$/, 'js');
    },
    transform: (inPath, outPath) => {
        const dir = path.dirname(inPath) + '/';
        const backPath = createBackPath(dir);
        const re = new RegExp(dir);
        const inFile = inPath.replace(re, '');
        const outFile = outPath.replace(re, '');
        const sourceMapFile = `${outFile}.map`;
        const command = [
            `cd ${dir}`,
            `${backPath}node_modules/babel-cli/bin/babel.js --presets es2015 ${inFile} --plugins add-module-exports --out-file ${outFile} --source-maps true`,
            `${backPath}node_modules/uglify-js/bin/uglifyjs --compress --output ${outFile} --source-map ${sourceMapFile} --in-source-map ${sourceMapFile}`,
            `${backPath}node_modules/mithril-objectify/bin/cli.js ${outFile} ${outFile}`
        ].join(' && ');
        return command;
    }
});

const createBackPath = (dir) => {
    var depth = (dir.match(/\//g) || []).length;
    var s = '';
    while (depth > 0) {
        s += '../';
        depth--;
    }
    return s;
};
