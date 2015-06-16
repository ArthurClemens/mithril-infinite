'use strict';
import m from 'mithril';
import infinite from 'infinite';

require('./images.css!');

const IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

let vm = {
    expanded: {},
    dirty: {},
    toggle: id => {
        if (vm.expanded[id]) {
            delete vm.expanded[id];
        } else {
            vm.expanded[id] = 1;
        }
        vm.dirty[id] = 1;
    },
    isExpanded: id => vm.expanded[id],
    isDirty: id => vm.dirty[id],
    clearDirty: id => delete vm.dirty[id]
};

let item = (data, opts) => {
    const id = opts.page + data.src;
    const isExpanded = vm.isExpanded(id);
    const isDirty = vm.isDirty(id);
    const heightFraction = isExpanded ? 0.5 : 0.25;

    return m('a.list-item', {
        style: {
            height: Math.floor(parseInt(data.height, 10) * heightFraction) + 'px'
        },
        onclick: () => {
            vm.toggle(id);
        }
    }, [
        m('span.pageNum', opts.page),
        m('.image', {
            style: {
                height: Math.floor(parseInt(data.height, 10) * heightFraction) + 'px',
                width: Math.floor(parseInt(data.width, 10) * heightFraction) + 'px'
            },
            config: (el, inited, context) => {
                if (context.inited && !isDirty) {
                    return;
                }
                if (infinite.isElementInViewport({el: el})) {
                    const url = IMG_URL + data.src;
                    el.style.backgroundImage = el.style.backgroundImage = 'url(' + url + ')';
                    context.inited = true;
                    vm.clearDirty(id);
                }
            }
        }),
        // minus or plus sign
        m('.toggle', isExpanded ? m.trust('&#150;') : m.trust('&#43;'))
    ]);
};

let component = {};
component.view = () => {
    return m.component(infinite, {
        maxPages: 20,
        item: item,
        pageUrl: page => 'app/images/data/page-' + page + '.json',
        preloadPages: 3,
        class: 'images',
        before: m('a', {
            class: ['list-item', vm.isExpanded('before') ? 'open' : 'closed'].join(' '),
            onclick: () => {
                vm.toggle('before');
            }}, [
                m('div', m.trust('A list of pugs. I didn\'t know they were called like that. Courtesy the <a href="http://airbnb.io/infinity/demo-off.html">AirBnb Infinity demo</a>.')),
                m('.toggle', vm.isExpanded('before') ? m.trust('&#150;') : m.trust('&#43;'))
            ]
        ),
        after: m('div.list-item', m.trust('That was the last pug.')),
        pageChange: page => {
            if (console) {
                console.log('page', page);
            }
        }
    });
};

export default component;
