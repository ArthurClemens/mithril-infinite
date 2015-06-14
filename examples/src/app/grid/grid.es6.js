'use strict';
import m from 'mithril';

import infinite from 'infinite';
require('./grid.css!');

const IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

let vm = {
    seen: {}
};

// fade in first time only
const fadeInImage = (el, imgUrl) => {
    const url = IMG_URL + imgUrl;
    const showImage = () => {
        el.style.backgroundImage = 'url(' + url + ')';
        el.style.opacity = 1;
        vm.seen[url] = 1;
    };
    if (!vm.seen[url]) {
        let img = new Image();
        img.onload = () => {
            showImage();
        };
        img.src = url;
    } else {
        showImage();
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
                        fadeInImage(el, data.src);
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
        item: item,
        pageUrl: page => 'app/grid/data/page-' + page + '.json',
        class: 'grid',
        pageChange: page => {
            if (console) {
                console.log('page', page);
            }
        }
    });
};

export default component;
