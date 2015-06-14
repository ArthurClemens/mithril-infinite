'use strict';
import m from 'mithril';

import infinite from 'infinite';
require('./table.css!');

let item = (data, opts) => {
    return m('.list-item', [
        m('div', opts.page),
        m('div', data || m.trust('&nbsp;'))
    ]);
};

let component = {};
component.view = () => {
    return m.component(infinite, {
        maxPages: 10,
        item: item,
        pageUrl: page => 'app/table/data/page-' + page + '.json',
        class: 'table',
        pageChange: page => {
            if (console) {
                console.log('page', page);
            }
        }
    });
};

export default component;
