System.config({
    'baseURL': '.',
    'transpiler': 'babel',
    'paths': {
        '*': '*.js',
        '*.css': '*.css',
        '*.svg': '*.svg'
    },
    'map': {
        'infinite': 'lib/infinite/infinite',
        'verge': 'lib/verge/verge.min',
        'mithril': 'lib/mithril/mithril.min',
        'css': 'lib/system-css/css',
        'text': 'lib/system-text/text'
    }
});
