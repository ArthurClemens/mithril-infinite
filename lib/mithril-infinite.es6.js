'use strict';

import verge from 'verge';
import m from 'mithril';

const SEL_PADDING = '000000';
const SCROLL_WATCH_TIMER = 200;
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

infinite.getElementSize = (el, axis) => {
    const styles = window.getComputedStyle(el);
    if (axis === 'x') {
        const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
        return Math.ceil(el.scrollWidth + margin);
    } else {
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        return Math.ceil(el.scrollHeight + margin);
    }
};

infinite.getCurrentPage = (scrollAmount, state) => {
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

infinite.calculateSize = (from, to, state) => {
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

infinite.isPageInViewport = (page, axis, state, scrollView) => {
    if (!scrollView) {
        return false;
    }
    const id = infinite.numToId(page);
    const el = scrollView.querySelector('[data-page="' + id + '"]');
    return infinite.isElementInViewport({el: el, axis: axis});
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

const getPageData = (url) => {
    return m.request({
        method: 'GET',
        url: url,
        initialValue: [],
        background: true
    });
};

let page = {};

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
        content: content
    };
};

page.view = (ctrl, opts = {}) => {
    const id = infinite.numToId(opts.page);
    const pageTag = opts.pageTag || 'div';
    const className = ['page', (opts.page % 2 === 0) ? 'even' : 'odd'].join(' ');
    const processPageData = opts.processPageData || ((content, opts1) => {
        return content ? content.map((data, index) => {
            return opts.item(data, opts1, index);
        }) : null;
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
            const size = infinite.getElementSize(el, opts.axis);
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
        scrollWatchScrollingStateId: null,
        scrollWatchUpdateStateId: null,
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
    const classList = ['scroll-view', 'scroll-view-' + (opts.axis || 'y')];
    if (opts.class) {
        classList.push(opts.class);
    }
    const startToContentSize = infinite.calculateStartToContent(currentPage, ctrl.preloadSlots, state);
    const contentSize = infinite.calculateContentSize(currentPage, ctrl.preloadSlots, state);
    const paddingBefore = startToContentSize - contentSize;
    const paddingAfter = opts.contentSize ? 0 : infinite.calculatePaddingAfter(currentPage, ctrl.preloadSlots, state);
    const isFirstPageVisible = infinite.isPageInViewport(1, opts.axis, state, ctrl.scrollView);
    const isLastPageVisible = opts.maxPages ? infinite.isPageInViewport(opts.maxPages, opts.axis, state, ctrl.scrollView) : true;

    if (ctrl.scrollView) {
        // in case the screen size was changed, reset preloadSlots
        const boundingClientRect = ctrl.scrollView.getBoundingClientRect();
        ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
        if ((boundingClientRect.width !== ctrl.boundingClientRect.width) || (boundingClientRect.height !== ctrl.boundingClientRect.height)) {
            ctrl.preloadSlots = opts.preloadPages || 1;
        }
        ctrl.boundingClientRect = boundingClientRect;

        // calculate if we have room to load more
        if (contentSize === 0) {
            setTimeout(() => {
                m.redraw();
            }, 0);
        } else if (contentSize > 0 && contentSize < boundingClientRect.height) {
            ctrl.preloadSlots++;
            setTimeout(() => {
                m.redraw();
            }, 0);
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
            const classList1 = classList.join(' ').split(' ');
            ctrl.scrollView.classList.add(...classList1);

            const handleScroll = () => {
                ctrl.isScrolling = true;

                // reset isScrolling state only when scrolling is done
                clearTimeout(ctrl.scrollWatchScrollingStateId);
                ctrl.scrollWatchScrollingStateId = setTimeout(() => {
                    ctrl.isScrolling = false;
                    // update pages
                    m.redraw();
                }, SCROLL_WATCH_TIMER);

                // debounce updates while scrolling
                if (!ctrl.scrollWatchUpdateStateId) {
                    ctrl.scrollWatchUpdateStateId = setTimeout(() => {
                        // update pages
                        m.redraw();
                        ctrl.scrollWatchUpdateStateId = null;
                    }, SCROLL_WATCH_TIMER);
                }
            };
            ctrl.scrollView.addEventListener('scroll', handleScroll);
            context.onunload = () => {
                ctrl.scrollView.removeEventListener('scroll', handleScroll);
            };
        }
    }, m('.scroll-content', {
        style: Object.assign({}, opts.axis === 'x' ? {
                width: paddingBefore + contentSize + paddingAfter + 'px'
            } : {
                height: paddingBefore + contentSize + paddingAfter + 'px'
            },
            opts.contentSize ? (opts.axis === 'x' ? {'min-width': opts.contentSize + 'px'} : {'min-height': opts.contentSize + 'px'}) : {}
        )}, [
            m('.padding-before', {
                style: Object.assign({}, opts.axis === 'x' ? {
                    width: paddingBefore + 'px'
                } : {
                    height: paddingBefore + 'px'
                }
            )}),
            m(contentTag, {
                class: 'content'
            }, [
                opts.before && contentSize ? m('.before', {
                    style: {
                        // visually hide this element until the last page is into view
                        // to prevent flashes of after content when scrolling fast
                        visibility: isFirstPageVisible ? 'visible' : 'hidden'
                    },
                    config: el => {
                        // always update the natural size
                        const size = infinite.getElementSize(el, opts.axis);
                        if (size) {
                            ctrl.state.before = size;
                        }
                    }
                }, opts.before) : null,
                m('.pages', pages.map(p => {
                        return m.component(page, Object.assign({}, opts, {
                            page: p,
                            key: p,
                            isScrolling: ctrl.isScrolling,
                            scrollView: ctrl.scrollView,
                            state: state
                        }));
                    })
                ),
                opts.after && contentSize ? m('.after', {
                    style: {
                        // visually hide this element until the last page is into view
                        // to prevent flashes of after content when scrolling fast
                        visibility: isLastPageVisible ? 'visible' : 'hidden'
                    },
                    config: el => {
                        // always update the natural size
                        const size = infinite.getElementSize(el, opts.axis);
                        if (size) {
                            ctrl.state.after = size;
                        }
                    }
                }, opts.after) : null
            ]),
            m('.padding-after', {
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
