import m from "mithril";
import { classes } from "./classes";
import { getElementSize, isElementInViewport } from "./util";
import { page } from "./page";
import { placeholder } from "./placeholder";
import "./css";

const SCROLL_WATCH_TIMER = 200;
const SEL_PADDING = "000000";

const numToId = pageNum =>
  SEL_PADDING.substring(0, SEL_PADDING.length - ("" + pageNum).length) + pageNum;

const calculateCurrentPageNum = (scrollAmount, state) => {
  const pageNumKeys = state.sortedKeys;
  let acc = state.beforeSize || 0;
  let currentPageNum = 1;
  for (let i = 0; i < pageNumKeys.length; i = i + 1) {
    let pageKey = pageNumKeys[i];
    if (scrollAmount > acc) {
      currentPageNum = parseInt(pageKey, 10);
    }
    acc += state.pageSizes[pageKey];
  }
  return currentPageNum;
};

const calculateContentSize = (from, to, state) => {
  const fromIndex = Math.max(0, from - 1);
  if (to < fromIndex) {
    return 0;
  }
  const toIndex = to;
  const pageNumKeys = state.sortedKeys.slice(fromIndex, toIndex);
  let size = state.beforeSize || 0;
  size = pageNumKeys.reduce((total, pageKey) => (
    total += state.pageSizes[pageKey] || 0
  ), size);
  size += state.afterSize || 0;
  return size;
};

const isPageInViewport = (page, axis, state, scrollView) => {
  if (!scrollView) {
    return false;
  }
  const id = numToId(page);
  const el = scrollView.querySelector("[data-page=\"" + id + "\"]");
  return isElementInViewport({ el, axis });
};

const updatePageSize = ctrl => (pageId, size) => (
  ctrl.state.pageSizes[pageId] = size,
  ctrl.state.sortedKeys = Object.keys(ctrl.state.pageSizes).sort()
);

export const infinite = {};

infinite.controller = (opts) => {
  // Memoize some properties that do not change
  const whichScroll = opts.axis === "x" ? "scrollLeft" : "scrollTop";
  const maxPages = opts.maxPages !== undefined ? opts.maxPages : Number.MAX_VALUE;
  const autoSize = (opts.autoSize !== undefined && opts.autoSize === false) ? false : true;
  const scrollThrottle = opts.throttle !== undefined ? opts.throttle * 1000 : SCROLL_WATCH_TIMER;
  const contentTag = opts.contentTag || "div";

  return {
    state: {
      pageSizes: {},
      sortedKeys: [],
      beforeSize: null,
      afterSize: null
    },
    scrollView: null,
    isScrolling: false,
    scrollWatchScrollingStateId: null,
    scrollWatchUpdateStateId: null,
    preloadSlots: opts.preloadPages || 1,
    boundingClientRect: {},
    currentPageNum: 0,
    scrollAmount: 0,

    // Memoized
    whichScroll,
    maxPages,
    autoSize,
    scrollThrottle,
    contentTag
  };
};

infinite.view = (ctrl, opts) => {
  const state = ctrl.state;
  ctrl.scrollAmount = ctrl.scrollView ? ctrl.scrollView[ctrl.whichScroll] : 0;
  
  const currentPageNum = opts.currentPage
    ? parseInt(opts.currentPage, 10)
    : calculateCurrentPageNum(ctrl.scrollAmount, state);

  if (currentPageNum !== ctrl.currentPageNum && opts.pageChange) {
    opts.pageChange(currentPageNum);
  }
  ctrl.currentPageNum = currentPageNum;

  if (ctrl.scrollView && opts.getDimensions) {
    opts.getDimensions({
      scrolled: ctrl.scrollAmount,
      size: ctrl.contentSize
    });
  }

  const minPageNum = opts.from
    ? parseInt(opts.from, 10)
    : opts.currentPage
      ? opts.currentPage
      : 1;
  const maxPageNum = opts.to
    ? parseInt(opts.to, 10)
    : opts.currentPage
      ? opts.currentPage
      : ctrl.maxPages;
  const pages = [];
  const prePages = [];
  for (let i = -ctrl.preloadSlots; i <= ctrl.preloadSlots; i = i + 1) {
    const pageNum = currentPageNum + i;
    if (pageNum >= minPageNum && pageNum <= maxPageNum) {
      pages.push(pageNum);
    }
  }
  for (let pageNum = 1; pageNum < pages[0]; pageNum = pageNum + 1) {
    prePages.push(pageNum);
  }

  const classList = [
    classes.scrollView,
    opts.axis === "x"
      ? classes.scrollViewX
      : classes.scrollViewY,
    opts.class
  ].join(" ");
  ctrl.contentSize = calculateContentSize(1, maxPageNum, state);
  const isLastPageVisible = maxPageNum
    ? isPageInViewport(maxPageNum, opts.axis, state, ctrl.scrollView)
    : true;

  if (ctrl.scrollView) {
    // in case the screen size was changed, reset preloadSlots
    const boundingClientRect = ctrl.scrollView.getBoundingClientRect();
    ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
    if (boundingClientRect.width !== ctrl.boundingClientRect.width
      || boundingClientRect.height !== ctrl.boundingClientRect.height
    ) {
      ctrl.preloadSlots = opts.preloadPages || 1;
    }
    ctrl.boundingClientRect = boundingClientRect;
    // calculate if we have room to load more
    const maxSlots = opts.maxPreloadPages || Number.MAX_VALUE;

    if (ctrl.contentSize
      && (ctrl.preloadSlots < pages.length)
      && (ctrl.preloadSlots <= maxSlots)
      && (ctrl.contentSize < boundingClientRect.height)
    ) {
      ctrl.preloadSlots++;
      setTimeout(m.redraw, 0);
    }
  }

  return m("div", {
    config: (el, inited, context) => {
      if (inited) {
        return;
      }
      if (opts.scrollView) {
        ctrl.scrollView = document.querySelector(opts.scrollView);
      } else {
        ctrl.scrollView = el;
      }
      ctrl.scrollView.className += " " + classList;

      if (opts.setDimensions) {
        const dimensions = opts.setDimensions();
        const whichSize = opts.axis === "x"
          ? "width"
          : "height";
        if (dimensions.size > 0) {
          el.style[whichSize] = dimensions.size + "px";
        }
        ctrl.scrollView[ctrl.whichScroll] = dimensions.scrolled;
      }

      const handleScroll = () => {
        ctrl.isScrolling = true;

        // reset isScrolling state only when scrolling is done
        clearTimeout(ctrl.scrollWatchScrollingStateId);
        ctrl.scrollWatchScrollingStateId = setTimeout(() => {
          ctrl.isScrolling = false;
          // update pages
          m.redraw();
        }, ctrl.scrollThrottle);

        // throttle updates while scrolling
        if (!ctrl.scrollWatchUpdateStateId) {
          ctrl.scrollWatchUpdateStateId = setTimeout(() => {
            // update pages
            m.redraw();
            ctrl.scrollWatchUpdateStateId = null;
          }, ctrl.scrollThrottle);
        }
      };
      ctrl.scrollView.addEventListener("scroll", handleScroll);
      context.onunload = () => {
        ctrl.scrollView.removeEventListener("scroll", handleScroll);
      };
    }
  }, m("div", {
    class: classes.scrollContent,
    style: !ctrl.autoSize
      ? {}
      : Object.assign(
        {},
        opts.axis === "x"
          ? { width: ctrl.contentSize + "px" }
          : { height: ctrl.contentSize + "px" },
        opts.contentSize
          ? opts.axis === "x"
            ? { "min-width": opts.contentSize + "px" }
            : { "min-height": opts.contentSize + "px" }
          : {}
    )
  }, [
    m(ctrl.contentTag, { class: classes.content }, [
      opts.before
        ? m("div", {
          class: classes.before,
          config: el => {
            // always update the natural size
            const size = getElementSize(el, opts.axis);
            if (size) {
              state.beforeSize = size;
            }
          }
        }, opts.before)
        : null,
      m("div", { class: classes.pages }, [
        prePages.map(pageNum => 
          m(placeholder, Object.assign(
            {},
            opts,
            {
              pageNum,
              pageId: numToId(pageNum),
              pageSizes: state.pageSizes
            }
          ))
        ),
        pages.map(pageNum =>
          m(page, Object.assign(
            {},
            opts,
            {
              pageNum,
              pageId: numToId(pageNum),
              isScrolling: ctrl.isScrolling,
              pageSizes: state.pageSizes,
              updatePageSize: updatePageSize(ctrl),
              autoSize: ctrl.autoSize
            }
          ))
        )
      ]),
      // only show "after" when content is available
      opts.after && ctrl.contentSize
        ? m("div", {
          class: classes.after,
          style: {
            // visually hide this element until the last page is into view
            // to prevent flashes of after content when scrolling fast
            visibility: isLastPageVisible ? "visible" : "hidden"
          },
          config: el => {
            // always update the natural size
            const size = getElementSize(el, opts.axis);
            if (size) {
              state.afterSize = size;
            }
          }
        }, opts.after)
        : null
    ])
  ]));
};

infinite.isElementInViewport = isElementInViewport;

