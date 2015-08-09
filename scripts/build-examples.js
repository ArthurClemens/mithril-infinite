var Builder = require('systemjs-builder');

var DESTINATION = process.argv[2];
var SRC_DIR = [DESTINATION, '/', 'src'].join('');
var BUILD_DIR = [DESTINATION, '/', 'build'].join('');
var appDir = [BUILD_DIR, '/', 'app'].join('');

var filesToMinify = [
    BUILD_DIR + '/lib/system-css/css.js',
    BUILD_DIR + '/lib/system-text/text.js',
    BUILD_DIR + '/lib/systemjs/es6-module-loader.js',
    BUILD_DIR + '/lib/systemjs/system.js'
];

var execute = function(command) {
    var exec = require('child_process').exec;
    var logError = function(error, stdout) {
        if (error && stdout) {
            console.log(error, stdout);
        }
    };
    exec(command, logError);
};

var cmds = [
    'rm', '-fR', BUILD_DIR,
    '&&',
    'mkdir', '-p', BUILD_DIR,
    '&&',
    'mkdir', '-p', BUILD_DIR + '/lib',
    '&&',
    'mkdir', '-p', BUILD_DIR + '/app',
    '&&',
    'cp', SRC_DIR + '/*.html', BUILD_DIR,
    '&&',
    'mkdir', '-p', BUILD_DIR + '/lib',
    '&&',
    'cp', SRC_DIR + '/config-build.js', BUILD_DIR + '/config.js',
    '&&',
    'cp', '-R', SRC_DIR + '/lib/systemjs', BUILD_DIR + '/lib/',
    '&&',
    'cp', '-R', SRC_DIR + '/lib/system-css', BUILD_DIR + '/lib/',
    '&&',
    'cp', '-R', SRC_DIR + '/lib/mithril-infinite', BUILD_DIR + '/lib/',
    '&&',
    'cp', '-R', SRC_DIR + '/app', BUILD_DIR,
    // clean up
    '&&',
    'rm', appDir + '/**/*.scss',
    '&&',
    'rm', appDir + '/**/*.es6.js',
    '&&',
    'rm', appDir + '/**/*.js',
    '&&',
    'rm', '-R', appDir + '/**/.sass-cache'
];

execute(cmds.join(' '));

filesToMinify.map(function(file) {
    execute([__dirname + '/../node_modules/.bin/uglifyjs', '-o', file, file].join(' '));
});

var builder = new Builder({
    'baseURL': SRC_DIR,
    'paths': {
        '*': '*.js',
        '*.css': '*.css',
        '*.svg': '*.svg'
    },
    'map': {
        'mithril-infinite': 'lib/mithril-infinite/mithril-infinite',
        'verge': 'lib/verge/verge.min',
        'mithril': 'lib/mithril/mithril.min',
        'css': 'lib/system-css/css',
        'text': 'lib/system-text/text'
    }
});

var buildOpts = {
    minify: true,
    sourceMaps: false
};

builder.build('app/index/index', BUILD_DIR + '/app/index/index.js', buildOpts).then(function() {
    console.log('Build complete');
})
.catch(function(err) {
    console.error(err);
});
