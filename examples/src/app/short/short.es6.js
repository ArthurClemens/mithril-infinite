'use strict';

import m from 'mithril';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import shortStyle from './short-style';
styler.add('short', false, shortStyle);

let short = {};
short.item = data => {
    const color = data[1] || 'transparent';
    const title = data[1] ? '' : m('.title', data[0]);
    return m('.list-item', {
        class: title ? 'has-title' : '',
        style: {
            'background-color': color
        }
    }, title);
};
short.view = () => {
    return m.component(infinite, {
        item: short.item,
        maxPages: 21,
        preloadSlots: 1,
        pageUrl: page => 'app/short/data/page-' + page + '.json',
        class: 'short',
        pageChange: page => {
            if (console) {
                console.log('page', page);
            }
        }
    });
};

export default short;
