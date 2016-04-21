'use strict';
import m from 'mithril';

import github from 'app/app/github';
import images from 'app/images/images';
import grid from 'app/grid/grid';
import table from 'app/table/table';
import short from 'app/short/short';
import horizontal from 'app/horizontal/horizontal';
import fixed from 'app/fixed/fixed';
import paging from 'app/paging/paging';

import styler from 'app/app/styler';
import commonStyle from 'app/app/common-style';
import indexStyle from './index-style';
styler.add('common', commonStyle);
styler.add('index', indexStyle);

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
    },
    {
        href: '/fixed',
        title: 'Fixed height',
        subtitle: 'Preset the scroll height, don\'t update scroll height'
    },
    {
        href: '/paging',
        title: 'Paging',
        subtitle: 'Prev/Next buttons instead of infinite scroll'
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
    return m('.index', [
        m('h1', 'Infinite Scroll for Mithril'),
        menu,
        github({home: true})
    ]);
};


m.route.mode = 'hash';
m.route(document.body, '/', {
    '/': app,
    '/images': images,
    '/grid': grid,
    '/table': table,
    '/short': short,
    '/horizontal': horizontal,
    '/fixed': fixed,
    '/paging': paging
});
