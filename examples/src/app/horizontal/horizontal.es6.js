'use strict';

import m from 'mithril';
import github from 'app/app/github';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import horizontalStyle from './horizontal-style';
styler.add('horizontal', false, horizontalStyle);

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
    return [
        m.component(infinite, {
            maxPages: 16,
            item: item,
            pageUrl: page => 'app/horizontal/data/page-' + page + '.json',
            class: 'horizontal',
            axis: 'x',
            pageSize: (content) => (content.length || 12) * (210 + 2 * 4), // values from CSS including margins
            pageChange: page => {
                if (console) {
                    console.log('page', page);
                }
            }
        }),
        github()
    ];
};

export default component;
