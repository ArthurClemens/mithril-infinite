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
  placeholder: "mithril-infinite__page--placeholder",
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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stream$1 = createCommonjsModule(function (module) {
	"use strict";

	var guid = 0,
	    HALT = {};
	function createStream() {
		function stream() {
			if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);
			return stream._state.value;
		}
		initStream(stream);

		if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);

		return stream;
	}
	function initStream(stream) {
		stream.constructor = createStream;
		stream._state = { id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined };
		stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream;
		stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf;

		Object.defineProperties(stream, {
			end: { get: function get() {
					if (!stream._state.endStream) {
						var endStream = createStream();
						endStream.map(function (value) {
							if (value === true) unregisterStream(stream), unregisterStream(endStream);
							return value;
						});
						stream._state.endStream = endStream;
					}
					return stream._state.endStream;
				} }
		});
	}
	function updateStream(stream, value) {
		updateState(stream, value);
		for (var id in stream._state.deps) {
			updateDependency(stream._state.deps[id], false);
		}finalize(stream);
	}
	function updateState(stream, value) {
		stream._state.value = value;
		stream._state.changed = true;
		if (stream._state.state !== 2) stream._state.state = 1;
	}
	function updateDependency(stream, mustSync) {
		var state = stream._state,
		    parents = state.parents;
		if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
			var value = stream._state.derive();
			if (value === HALT) return false;
			updateState(stream, value);
		}
	}
	function finalize(stream) {
		stream._state.changed = false;
		for (var id in stream._state.deps) {
			stream._state.deps[id]._state.changed = false;
		}
	}

	function combine(fn, streams) {
		if (!streams.every(valid)) throw new Error("Ensure that each item passed to m.prop.combine/m.prop.merge is a stream");
		return initDependency(createStream(), streams, function () {
			return fn.apply(this, streams.concat([streams.filter(changed)]));
		});
	}

	function initDependency(dep, streams, derive) {
		var state = dep._state;
		state.derive = derive;
		state.parents = streams.filter(notEnded);

		registerDependency(dep, state.parents);
		updateDependency(dep, true);

		return dep;
	}
	function registerDependency(stream, parents) {
		for (var i = 0; i < parents.length; i++) {
			parents[i]._state.deps[stream._state.id] = stream;
			registerDependency(stream, parents[i]._state.parents);
		}
	}
	function unregisterStream(stream) {
		for (var i = 0; i < stream._state.parents.length; i++) {
			var parent = stream._state.parents[i];
			delete parent._state.deps[stream._state.id];
		}
		for (var id in stream._state.deps) {
			var dependent = stream._state.deps[id];
			var index = dependent._state.parents.indexOf(stream);
			if (index > -1) dependent._state.parents.splice(index, 1);
		}
		stream._state.state = 2; //ended
		stream._state.deps = {};
	}

	function map(fn) {
		return combine(function (stream) {
			return fn(stream());
		}, [this]);
	}
	function ap(stream) {
		return combine(function (s1, s2) {
			return s1()(s2());
		}, [stream, this]);
	}
	function valueOf() {
		return this._state.value;
	}
	function toJSON() {
		return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value;
	}

	function valid(stream) {
		return stream._state;
	}
	function active(stream) {
		return stream._state.state === 1;
	}
	function changed(stream) {
		return stream._state.changed;
	}
	function notEnded(stream) {
		return stream._state.state !== 2;
	}

	function merge(streams) {
		return combine(function () {
			return streams.map(function (s) {
				return s();
			});
		}, streams);
	}
	createStream["fantasy-land/of"] = createStream;
	createStream.merge = merge;
	createStream.combine = combine;
	createStream.HALT = HALT;

	module["exports"] = createStream;
});

var stream = stream$1;

var getPageData = function getPageData(url) {
  return m.request({
    method: "GET",
    url: url
  });
};

var oninit$1 = function oninit(_ref) {
  var state = _ref.state,
      attrs = _ref.attrs;

  var pageNum = attrs.pageNum;
  var content = stream([]);
  if (attrs.pageData) {
    var result = attrs.pageData(pageNum);
    if (result.then) {
      // A Promise
      result.then(content);
    } else {
      content = result;
    }
  } else if (attrs.pageUrl) {
    var url = attrs.pageUrl(pageNum);
    getPageData(url).then(content);
  }

  var processPageData = attrs.processPageData || function (content, attrs1) {
    return content && content.length ? content.map(function (data, index) {
      return attrs.item(data, attrs1, index);
    }) : null;
  };

  state.content = content;
  // Memoize some properties that do not change
  state.className = makeClassName(pageNum);
  state.pageTag = attrs.pageTag || "div";
  state.processPageData = processPageData;
};

var view$1 = function view(_ref2) {
  var state = _ref2.state,
      attrs = _ref2.attrs;

  var pageId = attrs.pageId;
  var storedPageSize = attrs.pageSizes[pageId] || 0;
  var pageSize = 0;

  // attrs/pageSize overrides all measurements on elements here
  if (attrs.pageSize) {
    pageSize = attrs.pageSize(state.content());
    attrs.updatePageSize(pageId, pageSize);
  }

  var cssSize = pageSize ? pageSize + "px" : !attrs.autoSize || attrs.isScrolling && storedPageSize ? storedPageSize + "px" : "auto";
  var update = function update(dom) {
    if (pageSize) return;
    var size = getElementSize(dom, attrs.axis);
    if (size) {
      attrs.updatePageSize(pageId, size);
    }
    if (!storedPageSize) {
      // this is the very first measurement
      // make sure we use the first page size by calling the view again
      setTimeout(m.redraw, 0);
    }
  };

  return m(state.pageTag, {
    "data-page": pageId,
    class: state.className,
    style: storedPageSize ? attrs.axis === "x" ? { width: cssSize } : { height: cssSize } : null,
    oncreate: function oncreate(_ref3) {
      var dom = _ref3.dom;
      return update(dom);
    },
    onupdate: function onupdate(_ref4) {
      var dom = _ref4.dom;
      return update(dom);
    }
  }, state.processPageData(state.content(), {
    isScrolling: attrs.isScrolling,
    pageId: attrs.pageId,
    pageNum: attrs.pageNum
  }));
};

var page = {
  oninit: oninit$1,
  view: view$1
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var placeholder = {
  oninit: function oninit(vnode) {
    return (
      // Memoize some properties that do not change
      vnode.state.className = makeClassName(vnode.attrs.pageNum)
    );
  },
  view: function view(_ref) {
    var state = _ref.state,
        attrs = _ref.attrs;

    var pageId = attrs.pageId;
    var storedPageSize = attrs.pageSizes[pageId] || 0;
    return m("div", {
      "data-page": pageId,
      class: [classes.placeholder, state.className].join(" "),
      style: _extends({}, attrs.axis === "x" ? { width: storedPageSize + "px" } : { height: storedPageSize + "px" })
    });
  }
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

var styles = [defineProperty({}, "." + classes.scrollView, (_ref3 = {
  "-webkit-overflow-scrolling": "touch",
  height: "100%"

}, defineProperty(_ref3, "&." + classes.scrollViewY, defineProperty({
  overflowX: "hidden",
  overflowY: "auto",
  height: "100%"

}, " ." + classes.scrollContent, {
  height: "100%"
})), defineProperty(_ref3, "&." + classes.scrollViewX, defineProperty({
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%"

}, " ." + classes.scrollContent, {
  width: "100%"
})), _ref3))];

addStyle("mithril-infinite", styles);

var SCROLL_WATCH_TIMER = 200;
var SEL_PADDING = "000000";

var numToId = function numToId(pageNum) {
  return SEL_PADDING.substring(0, SEL_PADDING.length - ("" + pageNum).length) + pageNum;
};

var calculateCurrentPageNum = function calculateCurrentPageNum(scrollAmount, state) {
  var pageNumKeys = state.sortedKeys;
  if (pageNumKeys.length === 0) {
    return 1;
  }
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

var updatePageSize = function updatePageSize(state) {
  return function (pageId, size) {
    return state.pageSizes[pageId] = size, state.sortedKeys = Object.keys(state.pageSizes).sort();
  };
};

var handleScroll = function handleScroll(state, view, action) {
  var scroll = function scroll() {
    state.isScrolling = true;
    // reset isScrolling state only when scrolling is done
    clearTimeout(state.scrollWatchScrollingStateId);
    state.scrollWatchScrollingStateId = setTimeout(function () {
      state.isScrolling = false;
      // update pages
      m.redraw();
    }, state.scrollThrottle);
    // throttle updates while scrolling
    if (!state.scrollWatchUpdateStateId) {
      state.scrollWatchUpdateStateId = setTimeout(function () {
        // update pages
        m.redraw();
        state.scrollWatchUpdateStateId = null;
      }, state.scrollThrottle);
    }
  };
  if (action === "add") {
    view.addEventListener("scroll", scroll);
  } else {
    view.removeEventListener("scroll", scroll);
  }
};

var updatePart = function updatePart(dom, whichSize, state, axis) {
  var size = getElementSize(dom, axis);
  if (size) {
    state[whichSize] = size;
  }
};

var getPageList = function getPageList(currentPageNum, fromPage, toPage, currentPage, preloadSlots, maxPages) {
  var minPageNum = fromPage ? parseInt(fromPage, 10) : currentPage ? currentPage : 1;
  var maxPageNum = toPage ? parseInt(toPage, 10) : currentPage ? currentPage : maxPages;
  var pages = [];
  var prePages = [];
  for (var i = -preloadSlots; i <= preloadSlots; i = i + 1) {
    var pageNum = currentPageNum + i;
    if (pageNum >= minPageNum && pageNum <= maxPageNum) {
      pages.push(pageNum);
    }
  }
  for (var _pageNum = 1; _pageNum < pages[0]; _pageNum = _pageNum + 1) {
    prePages.push(_pageNum);
  }
  return { pages: pages, prePages: prePages, maxPageNum: maxPageNum };
};

var oninit = function oninit(vnode) {
  var attrs = vnode.attrs;
  // Memoize some properties that do not change
  var axis = attrs.axis || "y";
  var whichScroll = axis === "x" ? "scrollLeft" : "scrollTop";
  var autoSize = attrs.autoSize !== undefined && attrs.autoSize === false ? false : true;
  var pageSize = attrs.pageSize;
  var scrollThrottle = attrs.throttle !== undefined ? attrs.throttle * 1000 : SCROLL_WATCH_TIMER;
  var contentTag = attrs.contentTag || "div";
  var classList = [classes.scrollView, axis === "x" ? classes.scrollViewX : classes.scrollViewY, attrs.class].join(" ");

  vnode.state = _extends({}, {
    pageSizes: {},
    sortedKeys: [],
    beforeSize: null,
    afterSize: null,
    scrollView: null,
    isScrolling: false,
    scrollWatchScrollingStateId: null,
    scrollWatchUpdateStateId: null,
    preloadSlots: attrs.preloadPages || 1,
    boundingClientRect: {},
    currentPageNum: 0,
    scrollAmount: 0,

    // Memoized
    classList: classList,
    axis: axis,
    whichScroll: whichScroll,
    autoSize: autoSize,
    pageSize: pageSize,
    scrollThrottle: scrollThrottle,
    contentTag: contentTag
  });
};

var view = function view(_ref) {
  var state = _ref.state,
      attrs = _ref.attrs;

  state.scrollAmount = state.scrollView ? state.scrollView[state.whichScroll] : 0;
  var axis = state.axis;
  var maxPages = attrs.maxPages !== undefined ? attrs.maxPages : Number.MAX_VALUE;

  var currentPageNum = attrs.currentPage ? parseInt(attrs.currentPage, 10) : calculateCurrentPageNum(state.scrollAmount, state);

  if (attrs.pageChange && currentPageNum !== state.currentPageNum) {
    attrs.pageChange(currentPageNum);
  }
  state.currentPageNum = currentPageNum;

  if (state.scrollView && attrs.getDimensions) {
    attrs.getDimensions({
      scrolled: state.scrollAmount,
      size: state.contentSize
    });
  }

  var _getPageList = getPageList(currentPageNum, attrs.from, attrs.to, attrs.currentPage, state.preloadSlots, maxPages),
      pages = _getPageList.pages,
      prePages = _getPageList.prePages,
      maxPageNum = _getPageList.maxPageNum;

  state.contentSize = calculateContentSize(1, maxPageNum, state);
  var isLastPageVisible = maxPageNum ? isPageInViewport(maxPageNum, axis, state, state.scrollView) : true;

  if (state.scrollView) {
    // in case the screen size was changed, reset preloadSlots
    var boundingClientRect = state.scrollView.getBoundingClientRect();
    state.boundingClientRect = state.boundingClientRect || boundingClientRect;
    if (boundingClientRect.width !== state.boundingClientRect.width || boundingClientRect.height !== state.boundingClientRect.height) {
      state.preloadSlots = attrs.preloadPages || 1;
    }
    state.boundingClientRect = boundingClientRect;
    // calculate if we have room to load more
    var maxSlots = attrs.maxPreloadPages || Number.MAX_VALUE;

    if (state.contentSize && state.preloadSlots < pages.length && state.preloadSlots <= maxSlots && state.contentSize < boundingClientRect.height) {
      state.preloadSlots++;
      setTimeout(m.redraw, 0);
    }
  }

  return m("div", {
    oncreate: function oncreate(_ref2) {
      var dom = _ref2.dom;

      state.scrollView = attrs.scrollView ? document.querySelector(attrs.scrollView) : dom;
      state.scrollView.className += " " + state.classList;

      if (attrs.setDimensions) {
        var dimensions = attrs.setDimensions();
        if (dimensions.size > 0) {
          var whichSize = axis === "x" ? "width" : "height";
          dom.style[whichSize] = dimensions.size + "px";
        }
        state.scrollView[state.whichScroll] = dimensions.scrolled;
      }
      handleScroll(state, state.scrollView, "add");
    },
    onremove: function onremove() {
      return handleScroll(state, state.scrollView, "remove");
    }
  }, m("div", {
    class: classes.scrollContent,
    style: !state.autoSize ? null : _extends({}, axis === "x" ? { width: state.contentSize + "px" } : { height: state.contentSize + "px" }, attrs.contentSize ? axis === "x" ? { "min-width": attrs.contentSize + "px" } : { "min-height": attrs.contentSize + "px" } : {})
  }, [m(state.contentTag, { class: classes.content }, [attrs.before ? m("div", {
    class: classes.before,
    oncreate: function oncreate(_ref3) {
      var dom = _ref3.dom;
      return updatePart(dom, "before", state, axis);
    },
    onupdate: function onupdate(_ref4) {
      var dom = _ref4.dom;
      return updatePart(dom, "before", state, axis);
    }
  }, attrs.before) : null, m("div", { class: classes.pages }, [prePages.map(function (pageNum) {
    return m(placeholder, _extends({}, {
      axis: axis,
      key: numToId(pageNum),
      pageId: numToId(pageNum),
      pageNum: pageNum,
      pageSizes: state.pageSizes
    }));
  }), pages.map(function (pageNum) {
    return m(page, _extends({}, {
      autoSize: state.autoSize,
      axis: axis,
      isScrolling: state.isScrolling,
      item: attrs.item,
      key: numToId(pageNum),
      pageData: attrs.pageData,
      pageId: numToId(pageNum),
      pageNum: pageNum,
      pageSize: state.pageSize,
      pageSizes: state.pageSizes,
      pageTag: attrs.pageTag,
      pageUrl: attrs.pageUrl,
      updatePageSize: updatePageSize(state)
    }));
  })]),
  // only show "after" when content is available
  attrs.after && state.contentSize ? m("div", {
    class: classes.after,
    style: {
      // visually hide this element until the last page is into view
      // to prevent flashes of after content when scrolling fast
      visibility: isLastPageVisible ? "visible" : "hidden"
    },
    oncreate: function oncreate(_ref5) {
      var dom = _ref5.dom;
      return updatePart(dom, "after", state, axis);
    },
    onupdate: function onupdate(_ref6) {
      var dom = _ref6.dom;
      return updatePart(dom, "after", state, axis);
    }
  }, attrs.after) : null])]));
};

var infinite$1 = {
  oninit: oninit,
  view: view,
  isElementInViewport: isElementInViewport
};

export default infinite$1;
