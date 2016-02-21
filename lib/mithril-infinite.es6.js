'use strict';

import verge from 'verge';
import m from 'mithril';
import j2c from 'j2c';

const SEL_PADDING = '000000';
const SCROLL_WATCH_TIMER = 200;
const RESIZE_TIMER = 500;
const LEEWAY = 100;

const CSS_CLASSES = {
    scrollView: 'mithril-infinite__scroll-view',
    scrollViewX: 'mithril-infinite__scroll-view--x',
    scrollViewY: 'mithril-infinite__scroll-view--y',
    scrollContent: 'mithril-infinite__scroll-content',
    content: 'mithril-infinite__content',
    pages: 'mithril-infinite__pages',
    page: 'mithril-infinite__page',
    pageEven: 'mithril-infinite__page--even',
    pageOdd: 'mithril-infinite__page--odd',
    before: 'mithril-infinite__before',
    after: 'mithril-infinite__after',
    paddingBefore: 'mithril-infinite__padding-before',
    paddingAfter: 'mithril-infinite__padding-after'
};

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

const numToId = pageNum => SEL_PADDING.substring(0, SEL_PADDING.length - ('' + pageNum).length) + pageNum;

const getElementSize = (el, axis) => {
    const styles = window.getComputedStyle(el);
    if (axis === 'x') {
        const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
        return Math.ceil(el.scrollWidth + margin);
    } else {
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        return Math.ceil(el.scrollHeight + margin);
    }
};

const getCurrentPage = (scrollAmount, state) => {
    const pageNumKeys = Object.keys(state.dimensions).sort();
    let acc = state.before || 0;
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

const calculateSize = (from, to, state) => {
    const fromIndex = Math.max(0, from - 1);
    if (to < fromIndex) {
        return 0;
    }
    const toIndex = to;
    const pageNumKeys = Object.keys(state.dimensions).sort().slice(fromIndex, toIndex);
    let size = state.before || 0;
    pageNumKeys.forEach(pageKey => {
        size += state.dimensions[pageKey] || 0;
    });
    size += state.after || 0;
    return size;
};

const calculateStartToContent = (currentPage, preloadSlots, state) => {
    const from = 1;
    const to = currentPage + preloadSlots;
    return calculateSize(from, to, state);
};

const calculateContentSize = (currentPage, preloadSlots, state) => {
    const from = currentPage - preloadSlots;
    const to = currentPage + preloadSlots;
    return calculateSize(from, to, state);
};

const calculatePaddingAfter = (currentPage, preloadSlots, state) => {
    const from = currentPage + preloadSlots;
    const to = Object.keys(state.dimensions).length;
    return calculateSize(from, to, state);
};

const isPageInViewport = (page, axis, state, scrollView) => {
    if (!scrollView) {
        return false;
    }
    const id = numToId(page);
    const el = scrollView.querySelector('[data-page="' + id + '"]');
    return infinite.isElementInViewport({el: el, axis: axis});
};

const getPageData = (url) => {
    return m.request({
        method: 'GET',
        url,
        initialValue: [],
        background: true
    });
};

const page = {};

page.controller = (opts = {}) => {
    let content = m.prop([]);
    if (opts.pageData) {
        content = opts.pageData(opts.page);
    } else {
        const url = opts.pageUrl(opts.page);
        getPageData(url).then((data) => {
            content(data);
            m.redraw();
        });
    }

    return {
        content
    };
};

page.view = (ctrl, opts = {}) => {
    const id = numToId(opts.page);
    const pageTag = opts.pageTag || 'div';
    const className = [CSS_CLASSES.page, (opts.page % 2 === 0) ? CSS_CLASSES.pageEven : CSS_CLASSES.pageOdd].join(' ');
    const processPageData = opts.processPageData || ((content, opts1) => {
        return content ? content.map((data, index) => {
            return opts.item(data, opts1, index);
        }) : null;
    });
    const dimensions = opts.state.dimensions;
    const dimension = dimensions[id] || 0;

    // pageSize overrides all measurements on elements here
    let pageSize = 0;
    if (opts.pageSize) {
        pageSize = opts.pageSize(ctrl.content());
        dimensions[id] = pageSize;
    }
    const cssSize = pageSize
        ? pageSize + 'px'
        : (!opts.autoSize || (opts.isScrolling && dimension))
            ? dimension + 'px'
            : 'auto';
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
            const size = getElementSize(el, opts.axis);
            const prevSize = dimensions[id];
            if (size) {
                dimensions[id] = size;
            }
            if (!prevSize) {
                // this is the very first measurement
                // make sure we use the first dimension by calling the view again
                setTimeout(m.redraw, 0);
            }
        })
    }, processPageData(ctrl.content(), opts));
};

const infinite = {};
infinite.controller = (opts) => {
    return {
        state: {
            dimensions: {}
        },
        scrollView: null,
        isScrolling: false,
        scrollWatchScrollingStateId: null,
        scrollWatchUpdateStateId: null,
        paddingAfter: null,
        preloadSlots: opts.preloadPages || 1,
        boundingClientRect: {},
        currentPage: 0
    };
};
infinite.view = (ctrl, opts) => {
    const maxPages = opts.maxPages || Number.MAX_VALUE;
    const state = ctrl.state;
    const scrollAmount = ctrl.scrollView ? (opts.axis === 'x' ? ctrl.scrollView.scrollLeft : ctrl.scrollView.scrollTop) : 0;
    const scrollThrottle = (opts.throttle !== undefined) ? opts.throttle * 1000 : SCROLL_WATCH_TIMER;
    const autoSize = (opts.autoSize !== undefined && opts.autoSize === false) ? false : true;

    const currentPage = opts.currentPage
        ? parseInt(opts.currentPage, 10)
        : getCurrentPage(scrollAmount, state);

    if (currentPage !== ctrl.currentPage) {
        if (opts.pageChange) {
            opts.pageChange(currentPage);
        }
    }
    ctrl.currentPage = currentPage;

    const minPage = opts.from
        ? parseInt(opts.from, 10)
        : opts.currentPage
            ? opts.currentPage
            : 1;
    const maxPage = opts.to
        ? parseInt(opts.to, 10)
        : opts.currentPage
            ? opts.currentPage
            : maxPages;
    const pages = [];
    for (let i = -ctrl.preloadSlots; i <= ctrl.preloadSlots; i++) {
        const pageNum = currentPage + i;
        if (pageNum >= minPage && pageNum <= maxPage) {
            pages.push(pageNum);
        }
    }

    const slotCount = opts.from
        ? (opts.to - opts.from)
        : opts.currentPage
            ? 1
            : ctrl.preloadSlots;
    const contentTag = opts.contentTag || 'div';
    const classList = [CSS_CLASSES.scrollView, (opts.axis === 'x' ? CSS_CLASSES.scrollViewX : CSS_CLASSES.scrollViewY), opts.class].join(' ');
    const startToContentSize = (opts.from || opts.currentPage)
        ? 0
        : calculateStartToContent(currentPage, slotCount, state);
    const contentSize = calculateContentSize(currentPage, slotCount, state);
    const paddingBefore = (opts.from || opts.currentPage)
        ? 0
        : startToContentSize - contentSize;
    const paddingAfter = (opts.from || opts.currentPage)
        ? 0
        : opts.contentSize
            ? 0
            : calculatePaddingAfter(currentPage, slotCount, state);
    const isFirstPageVisible = isPageInViewport(minPage, opts.axis, state, ctrl.scrollView);
    const isLastPageVisible = maxPage
        ? isPageInViewport(maxPage, opts.axis, state, ctrl.scrollView)
        : true;

    if (ctrl.scrollView) {
        // in case the screen size was changed, reset preloadSlots
        const boundingClientRect = ctrl.scrollView.getBoundingClientRect();
        ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
        if ((boundingClientRect.width !== ctrl.boundingClientRect.width) || (boundingClientRect.height !== ctrl.boundingClientRect.height)) {
            ctrl.preloadSlots = opts.preloadPages || 1;
        }
        ctrl.boundingClientRect = boundingClientRect;
        // calculate if we have room to load more
        const maxSlots = opts.maxPreloadPages || Number.MAX_VALUE;

        if (contentSize && (ctrl.preloadSlots < pages.length) && (ctrl.preloadSlots <= maxSlots) && (contentSize < boundingClientRect.height)) {
            ctrl.preloadSlots++;
            setTimeout(m.redraw, 0);
        }
    }

    const content = m('div', {
        config: (el, inited, context) => {
            if (inited) {
                return;
            }
            if (opts.scrollView) {
                ctrl.scrollView = document.querySelector(opts.scrollView);
            } else {
                ctrl.scrollView = el;
            }
            ctrl.scrollView.className += (' ' + classList);

            const handleScroll = () => {
                ctrl.isScrolling = true;

                // reset isScrolling state only when scrolling is done
                clearTimeout(ctrl.scrollWatchScrollingStateId);
                ctrl.scrollWatchScrollingStateId = setTimeout(() => {
                    ctrl.isScrolling = false;
                    // update pages
                    m.redraw();
                }, scrollThrottle);

                // throttle updates while scrolling
                if (!ctrl.scrollWatchUpdateStateId) {
                    ctrl.scrollWatchUpdateStateId = setTimeout(() => {
                        // update pages
                        m.redraw();
                        ctrl.scrollWatchUpdateStateId = null;
                    }, scrollThrottle);
                }
            };
            ctrl.scrollView.addEventListener('scroll', handleScroll);
            context.onunload = () => {
                ctrl.scrollView.removeEventListener('scroll', handleScroll);
            };
        }
    }, m('div', {
        class: CSS_CLASSES.scrollContent,
        style: !autoSize
            ? {}
            : Object.assign(
                {},
                opts.axis === 'x'
                    ? {
                        width: paddingBefore + contentSize + paddingAfter + 'px'
                    }
                    : {
                        height: paddingBefore + contentSize + paddingAfter + 'px'
                    },
                opts.contentSize
                    ? (opts.axis === 'x'
                        ? {'min-width': opts.contentSize + 'px'}
                        : {'min-height': opts.contentSize + 'px'}
                    )
                    : {}
            )
    },
        [
            m('div', {
                class: CSS_CLASSES.paddingBefore,
                style: Object.assign(
                    {},
                    opts.axis === 'x'
                        ? {
                            width: paddingBefore + 'px'
                        }
                        : {
                            height: paddingBefore + 'px'
                        }
                    )}
            ),
            m(contentTag, {
                class: CSS_CLASSES.content
            }, [
                (opts.before && contentSize)
                    ? m('div', {
                        class: CSS_CLASSES.before,
                        style: {
                            // visually hide this element until the last page is into view
                            // to prevent flashes of after content when scrolling fast
                            visibility: isFirstPageVisible ? 'visible' : 'hidden'
                        },
                        config: el => {
                            // always update the natural size
                            const size = getElementSize(el, opts.axis);
                            if (size) {
                                ctrl.state.before = size;
                            }
                        }
                    }, opts.before)
                    : null,
                m('div', {
                    class: CSS_CLASSES.pages
                }, pages.map((p) => {
                    return m.component(page, Object.assign(
                        {},
                        opts,
                        {
                            page: p,
                            key: p,
                            isScrolling: ctrl.isScrolling,
                            scrollView: ctrl.scrollView,
                            state: state,
                            autoSize
                        }
                    ));
                })),
                (opts.after && contentSize)
                    ? m('div', {
                        class: CSS_CLASSES.after,
                        style: {
                            // visually hide this element until the last page is into view
                            // to prevent flashes of after content when scrolling fast
                            visibility: isLastPageVisible ? 'visible' : 'hidden'
                        },
                        config: el => {
                            // always update the natural size
                            const size = getElementSize(el, opts.axis);
                            if (size) {
                                ctrl.state.after = size;
                            }
                        }
                    }, opts.after)
                    : null
            ]),
            m('div', {
                class: CSS_CLASSES.paddingAfter,
                style: Object.assign(
                    {},
                    (opts.axis === 'x')
                        ? {
                            width: paddingAfter + 'px'
                        }
                        : {
                            height: paddingAfter + 'px'
                        }
                    )}
                )
        ]
    ));
    return content;
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

// Debounce window resize
let resizeTimer = 0;
window.onresize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(m.redraw, RESIZE_TIMER);
};

const styler = {
    /*
    * id: identifier, used as HTMLElement id for the attached <style></style> element
    * styles: list of lists style Objects
    */
    add: (id, ...styles) => {
        styler.remove(id);
        const styleEl = document.createElement('style');
        if (id) {
            styleEl.setAttribute('id', id);
        }
        styles.forEach((styleList) => {
            // each style returns a list
            if (Object.keys(styleList).length) {
                styleList.forEach((style) => {
                    const scoped = {'@global': style};
                    const sheet = j2c.sheet(scoped);
                    styleEl.appendChild(document.createTextNode(sheet));
                });
            }
        });
        document.head.appendChild(styleEl);
    },
    remove: (id) => {
        if (id) {
            const old = document.getElementById(id);
            if (old) {
                old.parentNode.removeChild(old);
            }
        }
    }
};

const styles = [{
    ['.' + CSS_CLASSES.scrollView]: {
        '-webkit-overflow-scrolling': 'touch',
        height: '100%',

        ['&.' + CSS_CLASSES.scrollViewY]: {
            'overflow-x': 'hidden',
            'overflow-y': 'auto',
            height: '100%',

            [' .' + CSS_CLASSES.scrollContent]: {
                height: '100%'
            }
        },

        ['&.' + CSS_CLASSES.scrollViewX]: {
            'overflow-x': 'auto',
            'overflow-y': 'hidden',
            width: '100%',

            [' .' + CSS_CLASSES.scrollContent]: {
                width: '100%'
            }
        }
    }
    // by default unstyled:
    // mithril-infinite__content
    // mithril-infinite__pages
    // mithril-infinite__page
    // mithril-infinite__padding-before
    // mithril-infinite__padding-after
}];

styler.add('mithril-infinite', styles);


export default infinite;
