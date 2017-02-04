import m from 'mithril';
import { prefixPlugin } from 'j2c-plugin-prefix-browser';
import J2c from 'j2c';
import infinite from 'mithril-infinite';

var j2c = new J2c(prefixPlugin);

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

var styleVariables = {
  size: 320,
  size_px: "320px",
  text_color: "#263238"
};

var appVariables = {
  imageUrl: "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/"
};

var SIDE_PADDING = 16;
var VERSION = "1.0.0";

var styles = [{
  ".footer": {
    width: styleVariables.size - 2 * SIDE_PADDING + "px",
    margin: "32px auto 0 auto",
    "text-align": "left",
    padding: "24px " + SIDE_PADDING + "px",
    "font-size": "14px",
    "line-height": 1.3,
    color: "#90A4AE",
    opacity: ".85",

    " hr": {
      height: "1px",
      border: "none",
      margin: "1em -" + SIDE_PADDING + "px",
      "background-color": "#CFD8DC",
      opacity: ".85"
    }
  }
}];

addStyle("footer", styles);

var footer = (function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return m(".footer", [!opts.home ? m("a", {
    href: "/",
    oncreate: m.route.link
  }, "All examples") : null, m("hr"), m.trust("mithril-infinite, Infinite Scroll for Mithril on mobile and desktop. This site runs on version " + VERSION + ". Project page on <a href=\"https://github.com/ArthurClemens/mithril-infinite\">Github</a>.")]);
});

var image_position = "56px";
var toggle_size = "40px";

var styles$1 = [{
  ".mithril-infinite__scroll-view.images": {
    margin: "0 auto",
    background: "#fff",

    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__before, .mithril-infinite__after": {
        " .list-item": {
          padding: "20px 70px 20px " + image_position,
          fontSize: "16px",
          minHeight: "60px"
        }
      },
      " .mithril-infinite__page": {
        minHeight: "400px" // prevent "after" content to show up on every scroll
      },
      " .mithril-infinite__page + .mithril-infinite__page": {
        borderTop: "1px solid #ddd"
      },
      " .mithril-infinite__page--odd": {
        backgroundColor: "#f0f0f0",

        " .list-item + .list-item": {
          borderTop: "1px solid #ddd"
        }
      },
      " .mithril-infinite__page--even": {
        "background-color": "#e0e0e0",

        " .list-item + .list-item": {
          borderTop: "1px solid #ccc"
        }
      },
      " .list-item": {
        position: "relative",
        display: "block",
        cursor: "pointer",

        ".open": {
          height: "160px"
        },
        ".closed": {
          height: "auto"
        },
        " .image": {
          display: "block",
          height: "100%",
          position: "absolute",
          left: image_position,
          top: 0,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat"
        },
        " .pageNum, .toggle": {
          position: "absolute",
          top: "8px",
          display: "block",
          color: "#222",
          width: toggle_size,
          height: toggle_size,
          textAlign: "center",
          lineHeight: toggle_size
        },
        " .pageNum": {
          left: "4px",
          fontSize: "13px",
          color: "#999"
        },
        " .toggle": {
          right: "10px",
          backgroundColor: "#fff"
        }
      }
    }
  }
}];

addStyle("images", styles$1);

var pageUrl = function pageUrl(pageNum) {
  return "data/images/page-" + pageNum + ".json";
};

var vm = {
  expanded: {},
  dirty: {},
  toggle: function toggle(id) {
    if (vm.expanded[id]) {
      delete vm.expanded[id];
    } else {
      vm.expanded[id] = 1;
    }
    vm.dirty[id] = 1;
  },
  isExpanded: function isExpanded(id) {
    return vm.expanded[id];
  },
  isDirty: function isDirty(id) {
    return vm.dirty[id];
  },
  clearDirty: function clearDirty(id) {
    return delete vm.dirty[id];
  }
};

var maybeUpdate = function maybeUpdate(dom, id, src) {
  if (!vm.isDirty(id)) {
    return;
  }
  if (infinite.isElementInViewport({ el: dom })) {
    var url = appVariables.imageUrl + src;
    dom.style.backgroundImage = dom.style.backgroundImage = "url(" + url + ")";
    vm.clearDirty(id);
  }
};

var item = function item(data, opts) {
  var id = opts.pageNum + data.width + data.src;
  var isExpanded = vm.isExpanded(id);
  var heightFraction = isExpanded ? 0.5 : 0.25;
  var width = parseFloat(data.width) * heightFraction;
  var height = parseFloat(data.height) * heightFraction;

  return m("a.list-item", {
    style: { height: height + "px" },
    onclick: function onclick() {
      return vm.toggle(id);
    }
  }, [m("span.pageNum", opts.pageNum), m(".image", {
    style: { height: height + "px", width: width + "px" },
    oncreate: function oncreate(_ref) {
      var dom = _ref.dom;
      return vm.dirty[id] = true, maybeUpdate(dom, id, data.src);
    },
    onupdate: function onupdate(_ref2) {
      var dom = _ref2.dom;
      return maybeUpdate(dom, id, data.src);
    }
  }),
  // minus or plus sign
  m(".toggle", isExpanded ? m.trust("&#150;") : m.trust("&#43;"))]);
};

var images = {
  view: function view() {
    return m(infinite, {
      maxPages: 20,
      item: item,
      pageUrl: pageUrl,
      preloadPages: 3,
      class: "images",
      before: m("a", {
        class: ["list-item", vm.isExpanded("before") ? "open" : "closed"].join(" "),
        onclick: function onclick() {
          return vm.toggle("before");
        }
      }, [m("div", m.trust("A list of pugs. Courtesy the <a href=\"http: //airbnb.io/infinity/demo-off.html\">AirBnb Infinity demo</a>.")), m(".toggle", vm.isExpanded("before") ? m.trust("&#150;") : m.trust("&#43;"))]),
      after: footer()
    });
  }
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

var gridSpacing = 8;
var itemWidth = 210;
var itemWidthPx = itemWidth + "px";
var imageHolderPadding = 10;
var imageHolderPaddingPx = imageHolderPadding + "px";

var makeMediaStyle = function makeMediaStyle(which, cols) {
  return defineProperty({}, "@media (" + which + "-width: " + ((cols + 1) * itemWidth + cols * gridSpacing) + "px)", {
    ".mithril-infinite__scroll-view.grid": {
      " .mithril-infinite__scroll-content": {
        " .mithril-infinite__content": {
          "width": cols * itemWidth + (cols - 1) * gridSpacing + "px"
        }
      }
    }
  });
};

var styles$2 = [makeMediaStyle("min", 4), makeMediaStyle("max", 4), makeMediaStyle("max", 3), makeMediaStyle("max", 2), makeMediaStyle("max", 1), {
  ".mithril-infinite__scroll-view.grid": {
    margin: "0 auto",

    " .mithril-infinite__scroll-content": {
      padding: 2 * gridSpacing + "px 0",

      " .mithril-infinite__content": {
        margin: "0 auto",
        fontSize: 0,
        lineHeight: 0,

        " .mithril-infinite__page": {
          margin: "0 " + -gridSpacing / 2 + "px"
        },
        " .grid-item": {
          display: "inline-block",
          height: itemWidthPx,
          width: itemWidthPx,
          backgroundColor: "#f0f0f0",
          margin: [0, gridSpacing / 2, gridSpacing, gridSpacing / 2].map(function (v) {
            return v + "px";
          }).join(" "),

          " .image-holder": {
            height: itemWidth - 2 * imageHolderPadding + "px",
            width: itemWidth - 2 * imageHolderPadding + "px",
            overflow: "hidden",
            position: "relative",
            margin: imageHolderPaddingPx,

            " .image": {
              position: "absolute",
              left: "auto",
              top: 0,
              right: "auto",
              bottom: 0,
              width: "100%",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%",
              opacity: 0,
              transition: "opacity .7s"
            }
          }
        }
      }
    }
  }
}];

addStyle("grid", styles$2);

var PAGE_ITEMS = 12;
var IMAGE_SIZE = 190;

var loadImage = function loadImage(el, imgUrl) {
  var url = imgUrl.replace(/\/150\//, "/" + IMAGE_SIZE + "/");
  var populate = function populate() {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
  };
  var img = new Image();
  img.onload = populate;
  img.src = imgUrl;
};

var maybeLoadImage = function maybeLoadImage(vnode, data) {
  if (vnode.state.inited) {
    return;
  }
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    loadImage(vnode.dom, data.thumbnailUrl);
    vnode.state.inited = true;
  }
};

var item$1 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    oncreate: function oncreate(vnode) {
      return maybeLoadImage(vnode, data);
    },
    onupdate: function onupdate(vnode) {
      return maybeLoadImage(vnode, data);
    }
  })));
};

var dataUrl = function dataUrl(pageNum) {
  return "http://jsonplaceholder.typicode.com/photos?_start=" + (pageNum - 1) * PAGE_ITEMS + "&_end=" + pageNum * PAGE_ITEMS;
};

var pageData = function pageData(pageNum) {
  return m.request({
    method: "GET",
    dataType: "jsonp",
    url: dataUrl(pageNum)
  });
};

var grid = {
  view: function view() {
    return m(infinite, {
      preloadPages: 3,
      item: item$1,
      pageData: pageData,
      class: "grid",
      after: footer()
    });
  }
};

var styles$3 = [{
  ".mithril-infinite__scroll-view.table": {
    minWidth: "320px",
    margin: "0 auto",
    background: "#eee",

    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__page": {
        display: "table",
        width: "100%"
      },
      " .mithril-infinite__page--odd": {
        backgroundColor: "#e4e4e4",

        " .list-item": {
          " > div": {
            color: "rgba(0,0,0,.87)",
            borderBottom: "1px solid rgba(0, 0, 0, .07)",

            ":first-child": {
              color: "rgba(0,0,0,.54)"
            }
          }
        }
      },
      " .mithril-infinite__page--even": {
        "background-color": "#f0f0f0"
      },
      " .list-item": {
        width: "100%",
        display: "table-row",

        " > div": {
          borderBottom: "1px solid rgba(0, 0, 0, .07)",
          display: "table-cell",
          verticalAlign: "top",
          padding: "8px 16px",
          minHeight: "1em",
          width: "90%",

          ":first-child": {
            color: "#aaa",
            width: "10%",
            textAlign: "right"
          }
        }
      }
    }
  }
}];

addStyle("table", styles$3);

var item$2 = function item(data, opts) {
  return m(".list-item", [m("div", opts.pageNum), m("div", data || m.trust("&nbsp;"))]);
};

var table = {
  view: function view() {
    return m(infinite, {
      maxPages: 10,
      item: item$2,
      pageUrl: function pageUrl(page) {
        return "data/table/page-" + page + ".json";
      },
      class: "table",
      after: footer()
    });
  }
};

var styles$4 = [{
  ".mithril-infinite__scroll-view.short": {
    minWidth: "320px",
    margin: "0 auto",
    background: "#eee",

    " .mithril-infinite__scroll-content": {
      " .list-item": {
        height: "8px",

        ".has-title": {
          fontSize: "18px",
          padding: "0 16px",
          height: "32px",
          lineHeight: "32px",
          color: "#222"
        }
      }
    }
  }
}];

addStyle("short", styles$4);

var item$3 = function item(data) {
  var color = data[1] || "transparent";
  var title = data[1] ? "" : m(".title", data[0]);
  return m(".list-item", {
    class: title ? "has-title" : "",
    style: { "background-color": color }
  }, title);
};

var short = {
  view: function view() {
    return m(infinite, {
      item: item$3,
      maxPages: 21,
      preloadSlots: 10,
      pageUrl: function pageUrl(page) {
        return "data/short/page-" + page + ".json";
      },
      class: "short",
      pageChange: function pageChange(page) {
        if (console) {
          console.log("page", page); // eslint-disable-line no-console
        }
      },
      after: footer()
    });
  }
};

var grid_spacing = 8;
var item_size = 210;
var item_size_px = item_size + "px";
var image_padding = 10;
var image_padding_px = image_padding + "px";

var styles$5 = [{
  ".mithril-infinite__scroll-view.horizontal": {
    margin: 0,
    height: item_size + 20 + "px", // add space for scrollbar
    background: "#fff",

    " .mithril-infinite__scroll-content": {
      padding: 0,
      margin: 0,
      fontSize: 0,

      " .mithril-infinite__content, .mithril-infinite__padding-before, .mithril-infinite__padding-after": {
        display: "inline-block"
      },
      " .mithril-infinite__content": {
        margin: 0,
        fontSize: 0,

        " .mithril-infinite__page": {
          display: "inline-block",
          height: item_size_px
        },

        " .grid-item": {
          display: "inline-block",
          height: item_size_px,
          width: item_size_px,
          backgroundColor: "#f0f0f0",
          margin: "0 " + grid_spacing / 2 + "px",

          " .image-holder": {
            height: item_size - 2 * image_padding + "px",
            width: item_size - 2 * image_padding + "px",
            overflow: "hidden",
            position: "relative",
            margin: image_padding_px,

            " .image": {
              position: "absolute",
              left: "auto",
              top: 0,
              right: "auto",
              bottom: 0,
              width: "100%",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%",
              opacity: 0,
              transition: "opacity .7s"
            }
          }
        }
      }
    }
  }
}];

addStyle("horizontal", styles$5);

var loadImage$1 = function loadImage(el, imgUrl) {
  var url = appVariables.imageUrl + imgUrl;
  var populate = function populate() {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
  };
  var img = new Image();
  img.onload = populate;
  img.src = url;
};

var maybeLoadImage$1 = function maybeLoadImage(vnode, data) {
  if (vnode.state.inited) {
    return;
  }
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    loadImage$1(vnode.dom, data.src);
    vnode.state.inited = true;
  }
};

var item$4 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    oncreate: function oncreate(vnode) {
      return maybeLoadImage$1(vnode, data);
    },
    onupdate: function onupdate(vnode) {
      return maybeLoadImage$1(vnode, data);
    }
  })));
};

var horizontal = {
  view: function view() {
    return [m(infinite, {
      maxPages: 16,
      item: item$4,
      pageUrl: function pageUrl(pageNum) {
        return "data/horizontal/page-" + pageNum + ".json";
      },
      class: "horizontal",
      axis: "x",
      pageSize: function pageSize(content) {
        return (content.length || 12) * (210 + 2 * 4);
      }, // values from CSS including margins
      pageChange: function pageChange(pageNum) {
        if (console) {
          console.log("page", pageNum); // eslint-disable-line no-console
        }
      }
    }), footer()];
  }
};

var styles$6 = [{
  ".mithril-infinite__scroll-view.table.fixed": {
    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__page": {
        " .list-item": {
          maxHeight: "36px",
          overflowY: "hidden"
        }
      },
      " .footer": {
        height: "133px"
      }
    }
  }
}];

/*
This example shows how to get the total page count from a request, and use that to calculate the total content height.
*/
addStyle("fixed", styles$6);

var PAGE_ITEMS$1 = 10;
var ITEM_HEIGHT = 36 + 1; // include border
var AFTER_CONTENT_HEIGHT = 133;

var dataUrl$1 = function dataUrl(pageNum) {
  return "http://jsonplaceholder.typicode.com/posts?_start=" + (pageNum - 1) * PAGE_ITEMS$1 + "&_end=" + pageNum * PAGE_ITEMS$1;
};

var item$5 = function item(data) {
  return m(".list-item", [m("div", data.id), m("div", data.title)]);
};

var fixed = {
  oninit: function oninit(vnode) {
    var state = vnode.state;
    state.pageCount = 1;

    state.pageData = function (pageNum) {
      return m.request({
        method: "GET",
        dataType: "jsonp",
        url: dataUrl$1(pageNum),
        extract: function extract(xhr) {
          return (
            // Read the total count from the header
            state.pageCount = Math.ceil(parseInt(xhr.getResponseHeader("X-Total-Count"), 10) / PAGE_ITEMS$1), JSON.parse(xhr.responseText)
          );
        }
      });
    };
  },
  view: function view(_ref) {
    var state = _ref.state;

    return m(infinite, {
      pageData: state.pageData,
      maxPages: state.pageCount,
      preloadPages: 3,
      item: item$5,
      class: "table fixed",
      // set the size of each page
      pageSize: function pageSize() {
        return PAGE_ITEMS$1 * ITEM_HEIGHT;
      },
      // set the total height
      contentSize: state.pageCount * PAGE_ITEMS$1 * ITEM_HEIGHT + AFTER_CONTENT_HEIGHT,
      after: footer()
    });
  }
};

var gridSpacing$1 = 8;
var pageWidth = 320;
var itemSize = (320 - 2 * gridSpacing$1) / 3;
var imageHolderPadding$1 = 10;
var imageHolderPaddingPx$1 = imageHolderPadding$1 + "px";

var styles$7 = [{
  ".paging": {
    width: pageWidth + "px",
    margin: "0 auto",

    " .mithril-infinite__scroll-view.mithril-infinite__scroll-view--y": {
      height: itemSize * 4 + gridSpacing$1 * 3 + 2 * gridSpacing$1 + "px"
    },
    " .mithril-infinite__page--placeholder": {
      height: "0 !important"
    },
    " .mithril-infinite__scroll-content": {
      margin: "0 auto",
      width: pageWidth + "px",
      padding: gridSpacing$1 + "px 0 0",

      " .mithril-infinite__content": {
        margin: "0 auto",
        fontSize: 0,
        lineHeight: 0,

        " .mithril-infinite__page": {
          margin: "0 " + -gridSpacing$1 / 2 + "px"
        },
        " .grid-item": {
          display: "inline-block",
          height: itemSize + "px",
          width: itemSize + "px",
          backgroundColor: "#f0f0f0",
          margin: [0, gridSpacing$1 / 2, gridSpacing$1, gridSpacing$1 / 2].map(function (v) {
            return v + "px";
          }).join(" "),

          " .image-holder": {
            height: itemSize - 2 * imageHolderPadding$1 + "px",
            width: itemSize - 2 * imageHolderPadding$1 + "px",
            overflow: "hidden",
            position: "relative",
            margin: imageHolderPaddingPx$1,

            " .image": {
              position: "absolute",
              left: "auto",
              top: 0,
              right: "auto",
              bottom: 0,
              width: "100%",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%"
            }
          }
        }
      }
    },
    " .count": {
      fontSize: "14px",
      lineHeight: 1,
      padding: "20px 0 10px 0",
      borderBottom: "1px solid #ddd"
    },
    " .pager": {
      borderTop: "1px solid #ddd",
      padding: "8px 0",
      width: pageWidth + "px",

      " a": {
        display: "inline-block",
        background: "#e0e0e0",
        color: "#333",
        padding: "10px 15px",
        textAlign: "center",
        fontSize: "15px",
        lineHeight: 1,
        margin: "0 5px 0 0",

        "&.disabled": {
          color: "#aaa",
          background: "#f4f4f4",
          pointerEvents: "none"
        }
      }
    }

  }
}];

addStyle("paging", styles$7);

var item$6 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    oncreate: function oncreate(_ref) {
      var dom = _ref.dom;

      dom.style.backgroundImage = "url(" + appVariables.imageUrl + data.src + ")";
    }
  })));
};

var getData = function getData(pageNum) {
  return m.request({
    method: "GET",
    url: "data/paging/page-" + pageNum + ".json"
  });
};

var paging = {
  oninit: function oninit(vnode) {
    var pageCount = 0;
    var pageNum = m.route.param("p") ? parseInt(m.route.param("p"), 10) : 1;

    var getPageData = function getPageData(pageNum) {
      return getData(pageNum).then(function (response) {
        return pageCount = response.length, response;
      });
    };

    vnode.state = {
      getPageData: getPageData,
      pageNum: pageNum,
      hasPrev: function hasPrev(num) {
        return num > 1;
      },
      hasNext: function hasNext(num) {
        return num < pageCount;
      }
    };
  },
  view: function view(vnode) {
    var state = vnode.state;
    var pageNum = m.route.param("p") ? parseInt(m.route.param("p"), 10) : state.pageNum;
    return m("div", [m(".paging", [m(".count", "Page " + pageNum), m(infinite, {
      item: item$6,
      pageData: state.getPageData,
      pageChange: function pageChange(num) {
        return state.pageNum = num;
      },
      currentPage: pageNum,
      autoSize: false // disabled because we are already setting the height in CSS
    }), m(".pager", [m("a", {
      class: !state.hasPrev(pageNum) ? "disabled" : "",
      href: "/paging/" + (pageNum - 1),
      oncreate: m.route.link
    }, "Prev"), m("a", {
      class: !state.hasNext(pageNum) ? "disabled" : "",
      href: "/paging/" + (pageNum + 1),
      oncreate: m.route.link
    }, "Next")])]), footer()]);
  }
};

var styles$8 = [{
  " *": {
    "box-sizing": "border-box"
  },
  " html, body, #app": {
    minHeight: "100%",
    height: "100%"
  },
  " body": {
    margin: 0,
    padding: 0,
    fontFamily: "arial, sans-serif",
    minWidth: styleVariables.size_px
  },
  " h1": {
    display: "block",
    margin: "40px auto 0 auto",
    width: "320px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "normal",
    color: styleVariables.text_color
  },
  " a": {
    "&:link, &:visited": {
      color: "#1E88E5",
      textDecoration: "none"
    }
  }
}];

var textColorLight = "#90A4AE";
var indexBlockBackgroundColor = "#CFD8DC";
var indexBlockTextColor = "rgba(0,0,0,.85)";
var indexBlockTextColorLight = "rgba(0,0,0,.4)";
var menuWidthPx = styleVariables.size_px;

var indexStyle = [{
  ".index": {
    " h1": {
      display: "block",
      margin: "40px auto 0 auto",
      width: styleVariables.size + "px",
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "normal",
      color: styleVariables.text_color
    },
    " .menu": {
      width: menuWidthPx,
      margin: "20px auto",
      padding: "0 0 20px 0",
      listStyle: "none",

      " li": {
        margin: "0 0 1px 0",
        padding: 0,

        "&.header": {
          fontSize: "18px",
          color: textColorLight
        },
        "&.header, a": {
          padding: "20px"
        },
        " a": {
          display: "block",
          textDecoration: "none",
          backgroundColor: indexBlockBackgroundColor,

          " .title": {
            display: "block",
            color: indexBlockTextColor,
            fontSize: "18px",
            lineHeight: 1.4 * 18 + "px"
          },
          " .subtitle": {
            display: "block",
            color: indexBlockTextColorLight,
            fontSize: "14px"
          }
        }
      }
    }
  }
}];

addStyle("common", styles$8);
addStyle("index", indexStyle);

var RESIZE_TIMER = 500;

var menuData = [{
  href: "/images",
  title: "Images",
  subtitle: "200 images of various heights"
}, {
  href: "/horizontal",
  title: "Horizontal",
  subtitle: "Horizontal scroller"
}, {
  href: "/grid",
  title: "Image grid",
  subtitle: "Responsive grid with 1, 2, 3 and 4 columns"
}, {
  href: "/table",
  title: "Data table",
  subtitle: "Table rows of various heights"
}, {
  href: "/short",
  title: "Short content",
  subtitle: "Automatically finds loadable space"
}, {
  href: "/fixed",
  title: "Fixed height",
  subtitle: "Preset the scroll height, don\"t update scroll height"
}, {
  href: "/paging",
  title: "Paging",
  subtitle: "Previous / Next buttons instead of infinite scroll"
}];

var menu = m("ul.menu", [m("li.header", "Examples"), menuData.map(function (menuItem) {
  return m("li", m("a", {
    href: menuItem.href,
    oncreate: m.route.link
  }, [m("span.title", menuItem.title), m("span.subtitle", menuItem.subtitle)]));
})]);

var app = {
  view: function view() {
    return m(".index", [m("h1", "Infinite Scroll for Mithril"), menu, footer({
      home: true
    })]);
  }
};

var mountNode = document.querySelector("#app");
m.route(mountNode, "/", {
  "/": app,
  "/images": images,
  "/grid": grid,
  "/table": table,
  "/short": short,
  "/horizontal": horizontal,
  "/fixed": fixed,
  "/paging": paging,
  "/paging/:p": paging
});

// Debounce window resize
var resizeTimer = 0;
window.onresize = function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(m.redraw, RESIZE_TIMER);
};
