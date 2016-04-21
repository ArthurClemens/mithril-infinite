const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');

const bundle = (entries, outfile) => {
    browserify({
        entries: entries,
        extensions: ['.es6'],
        paths: [
            '.',
            'node_modules'
        ],
        debug: true
    })
    .transform(babelify, {
        presets: ['es2015'],
        sourceMaps: true
    })
    .transform({
        global: true
    }, 'uglifyify')
    .bundle()
    .on('error', function(err) {
        console.log('Error : ' + err.message);
    })
    .pipe(fs.createWriteStream(outfile));
}

bundle([
    'app/index/index.es6.js'
], '../build/app/index/index-bundle.js');
