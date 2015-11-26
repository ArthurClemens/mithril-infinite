'use strict';

import m from 'mithril';
import github from 'app/app/github';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import gridStyle from './grid-style';
styler.add('grid', gridStyle);


const IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

let vm = {
    seen: {}
};

// fade in first time only
const showImage = (el, imgUrl) => {
    const url = IMG_URL + imgUrl;
    const populate = () => {
        el.style.backgroundImage = 'url(' + url + ')';
        vm.seen[url] = 1;
    };
    if (!vm.seen[url]) {
        let img = new Image();
        img.onload = () => {
            populate();
        };
        img.src = url;
    } else {
        populate();
    }
};

const item = (data) => {
    return m('a.grid-item',
        m('.image-holder',
            m('.image', {
                config: (el, inited, context) => {
                    if (context.inited) {
                        return;
                    }
                    if (infinite.isElementInViewport({el: el})) {
                        showImage(el, data.src);
                        context.inited = true;
                    }
                }
            })
        )
    );
};

let component = {};
component.view = () => {
    return m.component(infinite, {
        maxPages: 16, // pages of 12 items each
        preloadPages: 3,
        item: item,
        pageUrl: page => 'app/grid/data/page-' + page + '.json',
        class: 'grid',
        pageChange: page => {
            if (console) {
                console.log('page', page);
            }
        },
        after: github()
    });
};

export default component;
