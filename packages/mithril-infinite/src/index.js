import m from "mithril";
import { classes } from "./classes";
import { getElementSize, isElementInViewport } from "./util";
import { page } from "./page";
import { placeholder } from "./placeholder";
import "./css";

const SEL_PADDING = "000000";

const numToId = pageNum =>
  SEL_PADDING.substring(0, SEL_PADDING.length - ("" + pageNum).length) + pageNum;

const calculateCurrentPageNum = (scrollAmount, state) => {
  const pageNumKeys = state.sortedKeys;
  if (pageNumKeys.length === 0) {
    return 1;
  }
  let acc = state.before || 0;
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

/**
 * Calculates the content size without "before" and "after".
 */
const calculateContentSize = (from, to, state) => {
  const fromIndex = Math.max(0, from - 1);
  if (to < fromIndex) {
    return 0;
  }
  const toIndex = to;
  const pageNumKeys = state.sortedKeys.slice(fromIndex, toIndex);
  let size = 0;
  size = pageNumKeys.reduce((total, pageKey) => (
    total + (state.pageSizes[pageKey] || 0)
  ), size);
  return size;
};

const isPageInViewport = (page, axis, scrollView) => {
  if (!scrollView) {
    return false;
  }
  const id = numToId(page);
  const el = scrollView.querySelector(`[data-page="${id}"]`);
  return isElementInViewport({ el, axis });
};

const updatePageSize = state => (pageId, size) => {
  const oldSize = state.pageSizes[pageId];
  const newSize = parseInt(size, 10);
  if (oldSize !== newSize) {
    state.pageSizes[pageId] = newSize;
    state.sortedKeys = Object.keys(state.pageSizes).sort();
    calculatePreloadSlots(state);
    setTimeout(m.redraw);
  }
};

const updatePart = (dom, whichSize, state, axis) => {
  const size = getElementSize(dom, axis);
  if (size) {
    state[whichSize] = size;
  }
};

const calculatePreloadSlots = state => {
  if (!state.scrollView) return;
  const boundingClientRect = state.scrollView.getBoundingClientRect();
  state.boundingClientRect = state.boundingClientRect || boundingClientRect;
  if (boundingClientRect.width !== state.boundingClientRect.width
    || boundingClientRect.height !== state.boundingClientRect.height
  ) {
    state.preloadSlots = state.attrsPreloadSlots !== undefined ? state.attrsPreloadSlots : 1;
  }
  state.boundingClientRect = boundingClientRect;

  // calculate if we have room on the screen to show more slots
  if (state.contentSize
    && (state.preloadSlots < state.pageCount)
    && (state.preloadSlots <= state.attrsMaxPreloadSlots)
    && (state.contentSize < boundingClientRect.height)
  ) {
    state.preloadSlots++;
    setTimeout(m.redraw);
  }
};

const getPageList = (currentPageNum, fromPage, toPage, currentPage, preloadSlots, maxPages) => {
  const minPageNum = fromPage
    ? parseInt(fromPage, 10)
    : currentPage
      ? currentPage
      : 1;
  const maxPageNum = toPage
    ? parseInt(toPage, 10)
    : currentPage
      ? currentPage
      : maxPages;
  const pages = [];
  const prePages = [];

  for (let i = -preloadSlots; i <= preloadSlots; i = i + 1) {
    const pageNum = currentPageNum + i;
    if (pageNum >= minPageNum && pageNum <= maxPageNum) {
      pages.push(pageNum);
    }
  }
  for (let pageNum = 1; pageNum < pages[0]; pageNum = pageNum + 1) {
    prePages.push(pageNum);
  }
  return {pages, prePages, maxPageNum};
};

const oninit = vnode => {
  const attrs = vnode.attrs;
  // Memoize some properties that do not change
  const axis = attrs.axis || "y";
  const whichScroll = axis === "x" ? "scrollLeft" : "scrollTop";
  const autoSize = (attrs.autoSize !== undefined && attrs.autoSize === false) ? false : true;
  const pageSize = attrs.pageSize;
  const contentTag = attrs.contentTag || "div";
  const classList = [
    classes.scrollView,
    axis === "x"
      ? classes.scrollViewX
      : classes.scrollViewY,
    attrs.class
  ].join(" ");

  const scroll = m.redraw;

  Object.assign(vnode.state, {
    afterSize: 0,
    beforeSize: 0,
    boundingClientRect: {},
    currentPageNum: 0,
    pageSizes: {},
    preloadSlots: attrs.preloadPages !== undefined ? attrs.preloadPages : 1,
    scrollView: null,
    sortedKeys: [],

    // Memoized
    attrsMaxPreloadSlots: attrs.maxPreloadPages || Number.MAX_VALUE,
    attrsPreloadSlots: attrs.preloadPages !== undefined ? attrs.preloadPages : 1,
    autoSize,
    axis,
    classList,
    contentTag,
    pageSize,
    scroll,
    whichScroll,
  });
};

const view = ({ state, attrs }) => {
  const scrollAmount = state.scrollView ? state.scrollView[state.whichScroll] : 0;
  const axis = state.axis;
  const maxPages = attrs.maxPages !== undefined ? attrs.maxPages : Number.MAX_VALUE;
  
  const currentPageNum = attrs.currentPage
    ? parseInt(attrs.currentPage, 10)
    : calculateCurrentPageNum(scrollAmount, state);

  if (attrs.pageChange && currentPageNum !== state.currentPageNum) {
    attrs.pageChange(currentPageNum);
  }
  state.currentPageNum = currentPageNum;

  if (state.scrollView && attrs.getDimensions) {
    attrs.getDimensions({
      scrolled: scrollAmount,
      size: state.contentSize
    });
  }

  const { pages, prePages, maxPageNum } = getPageList(currentPageNum, attrs.from, attrs.to, attrs.currentPage, state.preloadSlots, maxPages);
  state.contentSize = attrs.contentSize !== undefined
    ? attrs.contentSize
    : calculateContentSize(1, maxPageNum, state);

  calculatePreloadSlots(state);

  state.pageCount = pages.length;

  const isLastPageVisible = maxPageNum
    ? isPageInViewport(maxPageNum, axis, state.scrollView)
    : true;
  
  
  return m("div",
    {
      oncreate: ({ dom }) => {
        state.scrollView = attrs.scrollView
          ? document.querySelector(attrs.scrollView)
          : dom;
        state.scrollView.className += " " + state.classList;

        if (attrs.setDimensions) {
          const dimensions = attrs.setDimensions();
          if (dimensions.size > 0) {
            const whichSize = axis === "x"
              ? "width"
              : "height";
            dom.style[whichSize] = dimensions.size + "px";
          }
          state.scrollView[state.whichScroll] = dimensions.scrolled;
        }
        state.scrollView.addEventListener("scroll", state.scroll);
      },
      onremove: () => state.scrollView.removeEventListener("scroll", state.scroll)
    },
    m("div",
      {
        class: classes.scrollContent,
        style: !state.autoSize
          ? null
          : Object.assign(
            {},
            axis === "x"
              ? { width: state.contentSize + state.beforeSize + state.afterSize + "px" }
              : { height: state.contentSize + state.beforeSize + state.afterSize + "px" },
            attrs.contentSize
              ? axis === "x"
                ? { "min-width": attrs.contentSize + state.beforeSize + state.afterSize + "px" }
                : { "min-height": attrs.contentSize + state.beforeSize + state.afterSize + "px" }
              : {}
          )
      },
      [
        m(state.contentTag, { class: classes.content }, [
          attrs.before
            ? m("div", {
              class: classes.before,
              oncreate: ({ dom }) => updatePart(dom, "beforeSize", state, axis),
              onupdate: ({ dom }) => updatePart(dom, "beforeSize", state, axis)
            }, attrs.before)
            : null,
          m("div", { class: classes.pages }, [
            prePages.map(pageNum => 
              m(placeholder, {
                axis,
                key: (attrs.pageKey || numToId)(pageNum),
                pageId: numToId(pageNum),
                pageNum,
                pageSizes: state.pageSizes
              })
            ),
            pages.map(pageNum =>
              m(page, {
                autoSize: state.autoSize,
                axis,
                item: attrs.item,
                key: (attrs.pageKey || numToId)(pageNum),
                pageData: attrs.pageData,
                pageId: numToId(pageNum),
                pageNum,
                pageSize: state.pageSize,
                pageSizes: state.pageSizes,
                pageTag: attrs.pageTag,
                pageUrl: attrs.pageUrl,
                updatePageSize: updatePageSize(state)
              })
            )
          ]),
          // only show "after" when content is available
          attrs.after && state.contentSize
            ? m("div", {
              class: classes.after,
              style: {
                // visually hide this element until the last page is into view
                // to prevent flashes of after content when scrolling fast
                visibility: isLastPageVisible ? "visible" : "hidden"
              },
              oncreate: ({ dom }) => updatePart(dom, "afterSize", state, axis),
              onupdate: ({ dom }) => updatePart(dom, "afterSize", state, axis),
            }, attrs.after)
            : null
        ])
      ]
    )
  );
};

export const infinite = {
  oninit,
  view,
  isElementInViewport
};

