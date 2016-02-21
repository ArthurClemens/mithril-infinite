System.config({
    baseURL: '.',
    defaultJSExtensions: true,
    transpiler: 'babel',
    babelOptions: {
        'optional': [
            'runtime',
            'optimisation.modules.system'
        ]
    },
    map: {
        'j2c': 'node_modules/j2c/dist/j2c.global.min',
        'mithril-infinite': 'node_modules/mithril-infinite/lib/mithril-infinite',
        'mithril': 'node_modules/mithril/mithril.min',
        'verge': 'node_modules/verge/verge.min'
    }
});
