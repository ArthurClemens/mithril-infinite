'use strict';

import verge from 'verge';
import m from 'mithril';
require('./infinite.css!');

const SEL_PADDING = '000000';
const SCROLL_WATCH_TIMER = 150;
const RESIZE_TIMER = 500;
const LEEWAY = 100;

/*
Polyfill source:
https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Object.assign/polyfill.js
*/
if (!Object.assign) {
    Object.assign = function assign(target, source) {
        for (let index = 1, key; index in arguments; ++index) {
            source = arguments[index];
            for (key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
}

let infinite = {};

infinite.numToId = pageNum => SEL_PADDING.substring(0, SEL_PADDING.length - ('' + pageNum).length) + pageNum;

infinite.getCurrentPage = (scrollAmount, state) => {
    const pageNumKeys = Object.keys(state.dimensions).sort();
    let acc = 0;
    let currentPage = 1;
    pageNumKeys.forEach(pageKey => {
        if (scrollAmount > acc) {
            currentPage = parseInt(pageKey, 10);
        }
        const size = state.dimensions[pageKey];
        acc += size;
    });
    return currentPage;
};

infinite.calculateSize = (from, to, state) => {
    const fromIndex = Math.max(0, from - 1);
    if (to < fromIndex) {
        return 0;
    }
    const toIndex = to;
    const pageNumKeys = Object.keys(state.dimensions).sort().slice(fromIndex, toIndex);
    let size = 0;
    pageNumKeys.forEach(pageKey => {
        size += state.dimensions[pageKey] || 0;
    });
    return size;
};

infinite.calculateStartToContent = (currentPage, preloadSlots, state) => {
    const from = 1;
    const to = currentPage + preloadSlots;
    return infinite.calculateSize(from, to, state);
};

infinite.calculateContentSize = (currentPage, preloadSlots, state) => {
    const from = currentPage - preloadSlots;
    const to = currentPage + preloadSlots;
    return infinite.calculateSize(from, to, state);
};

infinite.calculatePaddingAfter = (currentPage, preloadSlots, state) => {
    const from = currentPage + preloadSlots;
    const to = Object.keys(state.dimensions).length;
    return infinite.calculateSize(from, to, state);
};

// el, axis = 'y', expand = LEEWAY
infinite.isElementInViewport = (opts) => {
    const el = opts.el;
    const leeway = opts.leeway || LEEWAY;
    const axis = opts.axis || 'y';
    return {
        x: verge.inX(el, leeway),
        y: verge.inY(el, leeway),
        both: verge.inViewport(el, leeway)
    }[axis];
};

let page = {};
page.model = (url) => {
    return m.request({
        method: 'GET',
        url: url,
        initialValue: [],
        background: true
    });
};

page.controller = (opts = {}) => {
    let url = opts.pageUrl(opts.page);
    const content = page.model(url);
    content.then(m.redraw);

    return {
        content: content
    };
};

page.view = (ctrl, opts = {}) => {
    const id = infinite.numToId(opts.page);
    const pageTag = opts.pageTag || 'div';
    const className = ['page', (opts.page % 2 === 0) ? 'even' : 'odd'].join(' ');
    const processPageData = opts.processPageData || ((content, opts1) => {
        return content.map((data, index) => {
            return opts.item(data, opts1, index);
        });
    });
    const dimension = opts.state.dimensions[id] || 0;

    // pageSize overrides all measurements on elements here
    let pageSize = 0;
    if (opts.pageSize) {
        pageSize = opts.pageSize(ctrl.content());
        opts.state.dimensions[id] = pageSize;
    }
    const cssSize = pageSize ? pageSize + 'px' : (opts.isScrolling && dimension ? dimension + 'px' : 'auto');

    return m(pageTag, {
        'data-page': id,
        class: className,
        // during isScrolling a set size is needed to prevent glitches,
        // especially when isScrolling back
        style: dimension ? Object.assign({}, opts.axis === 'x' ? {
            width: cssSize
        } : {
            height: cssSize
        }) : {},
        config: pageSize ? {} : (el => {
            // always update the natural size
            const size = opts.axis === 'x' ? el.scrollWidth : el.scrollHeight;
            if (size) {
                opts.state.dimensions[id] = size;
            }
        })
    }, processPageData(ctrl.content(), opts));
};

infinite.controller = (opts) => {
    return {
        state: {
            dimensions: {}
        },
        maxPages: opts.maxPages || Number.MAX_VALUE,
        scrollView: null,
        isScrolling: false,
        scrollWatchId: null,
        paddingAfter: null,
        preloadSlots: opts.preloadPages || 1,
        boundingClientRect: {},
        currentPage: 0
    };
};

infinite.view = (ctrl, opts) => {
    const state = ctrl.state;
    const scrollAmount = ctrl.scrollView ? (opts.axis === 'x' ? ctrl.scrollView.scrollLeft : ctrl.scrollView.scrollTop) : 0;
    const currentPage = infinite.getCurrentPage(scrollAmount, state);

    if (currentPage !== ctrl.currentPage) {
        if (opts.pageChange) {
            opts.pageChange(currentPage);
        }
    }
    ctrl.currentPage = currentPage;

    let pages = [];
    for (let i = -ctrl.preloadSlots; i <= ctrl.preloadSlots; i++) {
        const pageNum = currentPage + i;
        if (pageNum > 0 && pageNum <= ctrl.maxPages) {
            pages.push(pageNum);
        }
    }

    const contentTag = opts.contentTag || 'div';
    const className = ['scroll-view', 'scroll-view-' + (opts.axis || 'y'), opts.class].join(' ');
    const startToContentSize = infinite.calculateStartToContent(currentPage, ctrl.preloadSlots, state);
    const contentSize = infinite.calculateContentSize(currentPage, ctrl.preloadSlots, state);
    const paddingBefore = startToContentSize - contentSize;
    const paddingAfter = infinite.calculatePaddingAfter(currentPage, ctrl.preloadSlots, state);

    if (ctrl.scrollView) {
        // in case the screen size was changed, reset preloadSlots
        const boundingClientRect = ctrl.scrollView.getBoundingClientRect();
        ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
        if ((boundingClientRect.width !== ctrl.boundingClientRect.width) || (boundingClientRect.height !== ctrl.boundingClientRect.height)) {
            ctrl.preloadSlots = opts.preloadPages || 1;
        }
        ctrl.boundingClientRect = boundingClientRect;

        // calculate if we have room to load more
        if (contentSize > 0 && contentSize < boundingClientRect.height) {
            ctrl.preloadSlots++;
            m.redraw();
        }
    }

    const content = m('div', {
        class: className,
        config: (el, inited) => {
            if (inited) {
                return;
            }
            ctrl.scrollView = el;
        },
        onscroll: () => {
            ctrl.isScrolling = true;
            // reset isScrolling state when scrolling is done
            clearTimeout(ctrl.scrollWatchId);
            ctrl.scrollWatchId = setTimeout(() => {
                ctrl.isScrolling = false;
                // update pages
                m.redraw();
            }, SCROLL_WATCH_TIMER);
        }
    }, m('.scroll-content', {
        style: Object.assign({}, opts.axis === 'x' ? {
                width: paddingBefore + contentSize + paddingAfter + 'px'
            } : {
                height: paddingBefore + contentSize + paddingAfter + 'px'
            }
        )}, [
            m('.paddingBefore', {
                style: Object.assign({}, opts.axis === 'x' ? {
                    width: paddingBefore + 'px'
                } : {
                    height: paddingBefore + 'px'
                }
            )}),
            m(contentTag, {
                class: 'content'
            }, pages.map(p => {
                return m.component(page, Object.assign({}, opts, {
                    page: p,
                    key: p,
                    isScrolling: ctrl.isScrolling,
                    scrollView: ctrl.scrollView,
                    state: state
                }));
            })),
            m('.paddingAfter', {
                style: Object.assign({}, opts.axis === 'x' ? {
                    width: paddingAfter + 'px'
                } : {
                    height: paddingAfter + 'px'
                }
            )})
        ]
    ));
    return content;
};

// Debounce window resize
let resizeTimer = 0;
window.onresize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        m.redraw();
    }, RESIZE_TIMER);
};

export default infinite;
