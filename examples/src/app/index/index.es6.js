'use strict';
import m from 'mithril';
import github from 'app/app/github';
import demoImages from 'app/images/images';
import demoGrid from 'app/grid/grid';
import demoTable from 'app/table/table';
import demoShort from 'app/short/short';
import demoHorizontal from 'app/horizontal/horizontal';

require('app/app/common.css!');
require('./index.css!');

const menuData = [
    {
        href: '/images',
        title: 'Images',
        subtitle: '200 images of various heights'
    },
    {
        href: '/grid',
        title: 'Image grid',
        subtitle: 'Responsive grid with 1, 2, 3 and 4 columns'
    },
    {
        href: '/table',
        title: 'Data table',
        subtitle: 'Table rows of various heights'
    },
    {
        href: '/short',
        title: 'Short content',
        subtitle: 'Automatically finds loadable space'
    },
    {
        href: '/horizontal',
        title: 'Horizontal',
        subtitle: 'Horizontal scroller'
    }
];

const menu = m('ul.menu', [
    m('li.header', 'Examples'),
    menuData.map(menuItem => {
        return m('li', m('a', {href: menuItem.href, config: m.route}, [
            m('span.title', menuItem.title),
            m('span.subtitle', menuItem.subtitle)
        ]));
    })
]);

let app = {};
app.view = () => {
    return m('div', [
        m('h1', 'Infinite Scroll for Mithril'),
        menu,
        github({home: true})
    ]);
};

m.route.mode = 'hash';
m.route(document.body, '/', {
    '/': app,
    '/images': demoImages,
    '/grid': demoGrid,
    '/table': demoTable,
    '/short': demoShort,
    '/horizontal': demoHorizontal
});
