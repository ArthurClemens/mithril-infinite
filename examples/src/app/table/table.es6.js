'use strict';

import m from 'mithril';
import github from 'app/app/github';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import tableStyle from './table-style';
styler.add('table', false, tableStyle);

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
        },
        after: github()
    });
};

export default component;
