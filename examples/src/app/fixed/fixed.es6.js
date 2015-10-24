'use strict';

import m from 'mithril';
import github from 'app/app/github';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import tableStyle from '../table/table-style';
import fixedStyle from './fixed-style';
styler.add('fixed', fixedStyle);

let item = (data, opts) => {
    return m('.list-item', [
        m('div', opts.page),
        m('div', data || m.trust('&nbsp;'))
    ]);
};

const PAGE_COUNT = 20;
const PAGE_ITEMS = 20;
const ITEM_HEIGHT = 35;
const AFTER_CONTENT_HEIGHT = 133;

let component = {};
component.view = () => {
    const scrollHeight = PAGE_COUNT * PAGE_ITEMS * ITEM_HEIGHT + AFTER_CONTENT_HEIGHT;
    return m.component(infinite, {
        maxPages: PAGE_COUNT,
        item: item,
        pageUrl: page => 'app/fixed/data/page-' + page + '.json',
        class: 'table fixed',
        // set the size of each page
        pageSize: () => (PAGE_ITEMS * ITEM_HEIGHT),
        // set the total height
        contentSize: scrollHeight,
        preloadPages: 2,
        after: github()
    });
};

export default component;
