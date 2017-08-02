import m from 'mithril';
import verge from 'verge';
import J2c from 'j2c';

var classes = {
  scrollView: "mithril-infinite__scroll-view",
  scrollViewX: "mithril-infinite__scroll-view--x",
  scrollViewY: "mithril-infinite__scroll-view--y",
  scrollContent: "mithril-infinite__scroll-content",
  content: "mithril-infinite__content",
  pages: "mithril-infinite__pages",
  page: "mithril-infinite__page",
  pageEven: "mithril-infinite__page--even",
  pageOdd: "mithril-infinite__page--odd",
  before: "mithril-infinite__before",
  after: "mithril-infinite__after"
};

var LEEWAY = 300;

var getElementSize = function getElementSize(el, axis) {
  var styles = window.getComputedStyle(el);
  if (axis === "x") {
    var margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    return el.scrollWidth + margin;
  } else {
    var _margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    return el.scrollHeight + _margin;
  }
};

// el, axis = "y", expand = LEEWAY
var isElementInViewport = function isElementInViewport(_ref) {
  var el = _ref.el,
      _ref$axis = _ref.axis,
      axis = _ref$axis === undefined ? "y" : _ref$axis,
      _ref$leeway = _ref.leeway,
      leeway = _ref$leeway === undefined ? LEEWAY : _ref$leeway;

  return axis === "y" ? verge.inY(el, leeway) || verge.inY(el, -leeway) : axis === "x" ? verge.inX(el, leeway) || verge.inX(el, -leeway) : verge.inViewport(el, leeway) || verge.inViewport(el, -leeway);
};

var makeClassName = function makeClassName(pageNum) {
  return [classes.page, pageNum % 2 === 0 ? classes.pageEven : classes.pageOdd].join(" ");
};

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getPageData = function getPageData(url) {
  return m.request({
    method: "GET",
    url: url,
    initialValue: [],
    background: true
  });
};

var page = {};

page.controller = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var pageNum = opts.pageNum;
  var content = m.prop([]);
  if (opts.pageData) {
    var result = opts.pageData(pageNum);
    if (result.then) {
      // A Promise
      result.then(function (r) {
        content(r);
        m.redraw();
      });
    } else {
      content = result;
    }
  } else if (opts.pageUrl) {
    var url = opts.pageUrl(pageNum);
    getPageData(url).then(function (data) {
      return content(data), m.redraw();
    });
  }

  return {
    content: content,
    // Memoize some properties that do not change
    className: makeClassName(pageNum),
    pageTag: opts.pageTag || "div"
  };
};

page.view = function (ctrl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var pageId = opts.pageId;
  var storedPageSize = opts.pageSizes[pageId] || 0;

  // pageSize overrides all measurements on elements here
  var pageSize = 0;
  if (opts.pageSize) {
    pageSize = opts.pageSize(ctrl.content());
    opts.updatePageSize(pageId, pageSize);
  }
  var cssSize = pageSize ? pageSize + "px" : !opts.autoSize || opts.isScrolling && storedPageSize ? storedPageSize + "px" : "auto";
  var processPageData = opts.processPageData || function (content, opts1) {
    return content ? content.map(function (data, index) {
      return opts.item(data, opts1, index);
    }) : null;
  };

  return m(ctrl.pageTag, {
    "data-page": pageId,
    class: ctrl.className,
    style: storedPageSize ? _extends$1({}, opts.axis === "x" ? { width: cssSize } : { height: cssSize }) : {},
    config: pageSize ? null : function (el) {
      // always update the natural size
      var size = getElementSize(el, opts.axis);
      if (size) {
        opts.updatePageSize(pageId, size);
      }
      if (!storedPageSize) {
        // this is the very first measurement
        // make sure we use the first page size by calling the view again
        setTimeout(m.redraw, 0);
      }
    }
  }, processPageData(ctrl.content(), opts));
};

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var placeholder = {};

placeholder.controller = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Memoize some properties that do not change
  return {
    className: makeClassName(opts.pageNum)
  };
};

placeholder.view = function (ctrl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var pageId = opts.pageId;
  var storedPageSize = opts.pageSizes[pageId] || 0;
  return m("div", {
    "data-page": pageId,
    class: ctrl.className,
    style: _extends$2({}, opts.axis === "x" ? { width: storedPageSize + "px" } : { height: storedPageSize + "px" })
  });
};

var j2c = new J2c();

/*
 * @param id: identifier, used as HTMLElement id for the attached <style></style> element
 * @param styles: list of lists style Objects
 */
var addStyle = function addStyle(id) {
  for (var _len = arguments.length, styles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    styles[_key - 1] = arguments[_key];
  }

  removeStyle(id);
  var styleEl = document.createElement("style");
  if (id) {
    styleEl.setAttribute("id", id);
  }
  styles.forEach(function (styleList) {
    // each style returns a list
    if (Object.keys(styleList).length) {
      styleList.forEach(function (style) {
        var scoped = { "@global": style };
        var sheet = j2c.sheet(scoped);
        styleEl.appendChild(document.createTextNode(sheet));
      });
    }
  });
  document.head.appendChild(styleEl);
};

var removeStyle = function removeStyle(id) {
  if (id) {
    var old = document.getElementById(id);
    if (old) {
      old.parentNode.removeChild(old);
    }
  }
};

var _ref3;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = [_defineProperty({}, "." + classes.scrollView, (_ref3 = {
  "-webkit-overflow-scrolling": "touch",
  height: "100%"

}, _defineProperty(_ref3, "&." + classes.scrollViewY, _defineProperty({
  overflowX: "hidden",
  overflowY: "auto",
  height: "100%"

}, " ." + classes.scrollContent, {
  height: "100%"
})), _defineProperty(_ref3, "&." + classes.scrollViewX, _defineProperty({
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%"

}, " ." + classes.scrollContent, {
  width: "100%"
})), _ref3))];

addStyle("mithril-infinite", styles);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var SCROLL_WATCH_TIMER = 200;
var SEL_PADDING = "000000";

var numToId = function numToId(pageNum) {
  return SEL_PADDING.substring(0, SEL_PADDING.length - ("" + pageNum).length) + pageNum;
};

var calculateCurrentPageNum = function calculateCurrentPageNum(scrollAmount, state) {
  var pageNumKeys = state.sortedKeys;
  var acc = state.beforeSize || 0;
  var currentPageNum = 1;
  for (var i = 0; i < pageNumKeys.length; i = i + 1) {
    var pageKey = pageNumKeys[i];
    if (scrollAmount > acc) {
      currentPageNum = parseInt(pageKey, 10);
    }
    acc += state.pageSizes[pageKey];
  }
  return currentPageNum;
};

var calculateContentSize = function calculateContentSize(from, to, state) {
  var fromIndex = Math.max(0, from - 1);
  if (to < fromIndex) {
    return 0;
  }
  var toIndex = to;
  var pageNumKeys = state.sortedKeys.slice(fromIndex, toIndex);
  var size = state.beforeSize || 0;
  size = pageNumKeys.reduce(function (total, pageKey) {
    return total += state.pageSizes[pageKey] || 0;
  }, size);
  size += state.afterSize || 0;
  return size;
};

var isPageInViewport = function isPageInViewport(page$$1, axis, state, scrollView) {
  if (!scrollView) {
    return false;
  }
  var id = numToId(page$$1);
  var el = scrollView.querySelector("[data-page=\"" + id + "\"]");
  return isElementInViewport({ el: el, axis: axis });
};

var updatePageSize = function updatePageSize(ctrl) {
  return function (pageId, size) {
    return ctrl.state.pageSizes[pageId] = size, ctrl.state.sortedKeys = Object.keys(ctrl.state.pageSizes).sort();
  };
};

var infinite$1 = {};

infinite$1.controller = function (opts) {
  // Memoize some properties that do not change
  var whichScroll = opts.axis === "x" ? "scrollLeft" : "scrollTop";
  var maxPages = opts.maxPages !== undefined ? opts.maxPages : Number.MAX_VALUE;
  var autoSize = opts.autoSize !== undefined && opts.autoSize === false ? false : true;
  var scrollThrottle = opts.throttle !== undefined ? opts.throttle * 1000 : SCROLL_WATCH_TIMER;
  var contentTag = opts.contentTag || "div";

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
    whichScroll: whichScroll,
    maxPages: maxPages,
    autoSize: autoSize,
    scrollThrottle: scrollThrottle,
    contentTag: contentTag
  };
};

infinite$1.view = function (ctrl, opts) {
  var state = ctrl.state;
  ctrl.scrollAmount = ctrl.scrollView ? ctrl.scrollView[ctrl.whichScroll] : 0;

  var currentPageNum = opts.currentPage ? parseInt(opts.currentPage, 10) : calculateCurrentPageNum(ctrl.scrollAmount, state);

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

  var minPageNum = opts.from ? parseInt(opts.from, 10) : opts.currentPage ? opts.currentPage : 1;
  var maxPageNum = opts.to ? parseInt(opts.to, 10) : opts.currentPage ? opts.currentPage : ctrl.maxPages;
  var pages = [];
  var prePages = [];
  for (var i = -ctrl.preloadSlots; i <= ctrl.preloadSlots; i = i + 1) {
    var pageNum = currentPageNum + i;
    if (pageNum >= minPageNum && pageNum <= maxPageNum) {
      pages.push(pageNum);
    }
  }
  for (var _pageNum = 1; _pageNum < pages[0]; _pageNum = _pageNum + 1) {
    prePages.push(_pageNum);
  }

  var classList = [classes.scrollView, opts.axis === "x" ? classes.scrollViewX : classes.scrollViewY, opts.class].join(" ");
  ctrl.contentSize = calculateContentSize(1, maxPageNum, state);
  var isLastPageVisible = maxPageNum ? isPageInViewport(maxPageNum, opts.axis, state, ctrl.scrollView) : true;

  if (ctrl.scrollView) {
    // in case the screen size was changed, reset preloadSlots
    var boundingClientRect = ctrl.scrollView.getBoundingClientRect();
    ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
    if (boundingClientRect.width !== ctrl.boundingClientRect.width || boundingClientRect.height !== ctrl.boundingClientRect.height) {
      ctrl.preloadSlots = opts.preloadPages || 1;
    }
    ctrl.boundingClientRect = boundingClientRect;
    // calculate if we have room to load more
    var maxSlots = opts.maxPreloadPages || Number.MAX_VALUE;

    if (ctrl.contentSize && ctrl.preloadSlots < pages.length && ctrl.preloadSlots <= maxSlots && ctrl.contentSize < boundingClientRect.height) {
      ctrl.preloadSlots++;
      setTimeout(m.redraw, 0);
    }
  }

  return m("div", {
    config: function config(el, inited, context) {
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
        var dimensions = opts.setDimensions();
        var whichSize = opts.axis === "x" ? "width" : "height";
        if (dimensions.size > 0) {
          el.style[whichSize] = dimensions.size + "px";
        }
        ctrl.scrollView[ctrl.whichScroll] = dimensions.scrolled;
      }

      var handleScroll = function handleScroll() {
        ctrl.isScrolling = true;

        // reset isScrolling state only when scrolling is done
        clearTimeout(ctrl.scrollWatchScrollingStateId);
        ctrl.scrollWatchScrollingStateId = setTimeout(function () {
          ctrl.isScrolling = false;
          // update pages
          m.redraw();
        }, ctrl.scrollThrottle);

        // throttle updates while scrolling
        if (!ctrl.scrollWatchUpdateStateId) {
          ctrl.scrollWatchUpdateStateId = setTimeout(function () {
            // update pages
            m.redraw();
            ctrl.scrollWatchUpdateStateId = null;
          }, ctrl.scrollThrottle);
        }
      };
      ctrl.scrollView.addEventListener("scroll", handleScroll);
      context.onunload = function () {
        ctrl.scrollView.removeEventListener("scroll", handleScroll);
      };
    }
  }, m("div", {
    class: classes.scrollContent,
    style: !ctrl.autoSize ? {} : _extends({}, opts.axis === "x" ? { width: ctrl.contentSize + "px" } : { height: ctrl.contentSize + "px" }, opts.contentSize ? opts.axis === "x" ? { "min-width": opts.contentSize + "px" } : { "min-height": opts.contentSize + "px" } : {})
  }, [m(ctrl.contentTag, { class: classes.content }, [opts.before ? m("div", {
    class: classes.before,
    config: function config(el) {
      // always update the natural size
      var size = getElementSize(el, opts.axis);
      if (size) {
        state.beforeSize = size;
      }
    }
  }, opts.before) : null, m("div", { class: classes.pages }, [prePages.map(function (pageNum) {
    return m(placeholder, _extends({}, opts, {
      pageNum: pageNum,
      pageId: numToId(pageNum),
      pageSizes: state.pageSizes
    }));
  }), pages.map(function (pageNum) {
    return m(page, _extends({}, opts, {
      pageNum: pageNum,
      pageId: numToId(pageNum),
      isScrolling: ctrl.isScrolling,
      pageSizes: state.pageSizes,
      updatePageSize: updatePageSize(ctrl),
      autoSize: ctrl.autoSize
    }));
  })]),
  // only show "after" when content is available
  opts.after && ctrl.contentSize ? m("div", {
    class: classes.after,
    style: {
      // visually hide this element until the last page is into view
      // to prevent flashes of after content when scrolling fast
      visibility: isLastPageVisible ? "visible" : "hidden"
    },
    config: function config(el) {
      // always update the natural size
      var size = getElementSize(el, opts.axis);
      if (size) {
        state.afterSize = size;
      }
    }
  }, opts.after) : null])]));
};

infinite$1.isElementInViewport = isElementInViewport;

export default infinite$1;
