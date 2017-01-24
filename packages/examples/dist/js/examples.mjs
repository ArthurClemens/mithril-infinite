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

var vars = {
  size: 320,
  size_px: "320px",
  text_color: "#263238"
};

var side_padding = 16;

var styles = [{
  ".github": {
    width: vars.size - 2 * side_padding + "px",
    margin: "32px auto 0 auto",
    "text-align": "left",
    padding: "24px " + side_padding + "px",
    "font-size": "14px",
    "line-height": 1.3,
    color: "#90A4AE",
    opacity: ".85",

    " hr": {
      height: "1px",
      border: "none",
      margin: "1em -" + side_padding + "px",
      "background-color": "#CFD8DC",
      opacity: ".85"
    }
  }
}];

addStyle("github", styles);

var github = function github() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return m(".github", [!opts.home ? m("a", {
    href: "/",
    config: m.route
  }, "All examples") : null, m("hr"), m.trust("mithril-infinite, Infinite Scroll for Mithril on mobile and desktop. Project page on <a href=\"https://github.com/ArthurClemens/mithril-infinite\">Github</a>.")]);
};

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

var IMG_URL = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

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

var item = function item(data, opts) {
  var id = opts.page + data.src;
  var isExpanded = vm.isExpanded(id);
  var isDirty = vm.isDirty(id);
  var heightFraction = isExpanded ? 0.5 : 0.25;

  return m("a.list-item", {
    style: {
      height: parseFloat(data.height) * heightFraction + "px"
    },
    onclick: function onclick() {
      vm.toggle(id);
    }
  }, [m("span.pageNum", opts.page), m(".image", {
    style: {
      height: parseFloat(data.height) * heightFraction + "px",
      width: parseFloat(data.width) * heightFraction + "px"
    },
    config: function config(el, inited, context) {
      if (context.inited && !isDirty) {
        return;
      }
      if (infinite.isElementInViewport({
        el: el
      })) {
        var url = IMG_URL + data.src;
        el.style.backgroundImage = el.style.backgroundImage = "url(" + url + ")";
        context.inited = true;
        vm.clearDirty(id);
      }
    }
  }),
  // minus or plus sign
  m(".toggle", isExpanded ? m.trust("&#150;") : m.trust("&#43;"))]);
};

var component = {};
component.view = function () {
  return m(infinite, {
    maxPages: 20,
    item: item,
    pageUrl: function pageUrl(page) {
      return "data/images/page-" + page + ".json";
    },
    preloadPages: 3,
    class: "images",
    before: m("a", {
      class: ["list-item", vm.isExpanded("before") ? "open" : "closed"].join(" "),
      onclick: function onclick() {
        vm.toggle("before");
      }
    }, [m("div", m.trust("A list of pugs. Courtesy the <a href=\"http: //airbnb.io/infinity/demo-off.html\">AirBnb Infinity demo</a>.")), m(".toggle", vm.isExpanded("before") ? m.trust("&#150;") : m.trust("&#43;"))]),
    after: github(),
    pageChange: function pageChange(page) {
      if (console) {
        console.log("page", page); // eslint-disable-line no-console
      }
    }
  });
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

var IMG_URL$1 = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

var vm$1 = {
  seen: {}
};

// fade in first time only
var showImage = function showImage(el, imgUrl) {
  var url = IMG_URL$1 + imgUrl;
  var populate = function populate() {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
    vm$1.seen[url] = 1;
  };
  if (!vm$1.seen[url]) {
    var img = new Image();
    img.onload = function () {
      populate();
    };
    img.src = url;
  } else {
    populate();
  }
};

var item$1 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    config: function config(el, inited, context) {
      if (context.inited) {
        return;
      }
      if (infinite.isElementInViewport({
        el: el
      })) {
        showImage(el, data.src);
        context.inited = true;
      }
    }
  })));
};

var component$1 = {};
component$1.view = function () {
  return m(infinite, {
    maxPages: 16, // pages of 12 items each
    preloadPages: 3,
    item: item$1,
    pageUrl: function pageUrl(page) {
      return "data/grid/page-" + page + ".json";
    },
    class: "grid",
    pageChange: function pageChange(page) {
      if (console) {
        console.log("page", page); // eslint-disable-line no-console
      }
    },
    after: github()
  });
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
  return m(".list-item", [m("div", opts.page), m("div", data || m.trust("&nbsp;"))]);
};

var component$2 = {};
component$2.view = function () {
  return m(infinite, {
    maxPages: 10,
    item: item$2,
    pageUrl: function pageUrl(page) {
      return "data/table/page-" + page + ".json";
    },
    class: "table",
    pageChange: function pageChange(page) {
      if (console) {
        console.log("page", page); // eslint-disable-line no-console
      }
    },
    after: github()
  });
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

var short = {};
short.item = function (data) {
  var color = data[1] || "transparent";
  var title = data[1] ? "" : m(".title", data[0]);
  return m(".list-item", {
    class: title ? "has-title" : "",
    style: {
      "background-color": color
    }
  }, title);
};
short.view = function () {
  return m(infinite, {
    item: short.item,
    maxPages: 21,
    preloadSlots: 1,
    pageUrl: function pageUrl(page) {
      return "data/short/page-" + page + ".json";
    },
    class: "short",
    pageChange: function pageChange(page) {
      if (console) {
        console.log("page", page); // eslint-disable-line no-console
      }
    }
  });
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

var IMG_URL$2 = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";
var vm$2 = {
  seen: {}
};

// fade in first time only
var fadeInImage = function fadeInImage(el, imgUrl) {
  var url = IMG_URL$2 + imgUrl;
  var showImage = function showImage() {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
    vm$2.seen[url] = 1;
  };
  if (!vm$2.seen[url]) {
    var img = new Image();
    img.onload = function () {
      showImage();
    };
    img.src = url;
  } else {
    showImage();
  }
};

var item$3 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    config: function config(el, inited, context) {
      if (context.inited) {
        return;
      }
      if (infinite.isElementInViewport({
        el: el
      })) {
        fadeInImage(el, data.src);
        context.inited = true;
      }
    }
  })));
};

var component$3 = {};
component$3.view = function () {
  return [m(infinite, {
    maxPages: 16,
    item: item$3,
    pageUrl: function pageUrl(page) {
      return "data/horizontal/page-" + page + ".json";
    },
    class: "horizontal",
    axis: "x",
    pageSize: function pageSize(content) {
      return (content.length || 12) * (210 + 2 * 4);
    }, // values from CSS including margins
    pageChange: function pageChange(page) {
      if (console) {
        console.log("page", page); // eslint-disable-line no-console
      }
    }
  }), github()];
};

var styles$6 = [{
  ".mithril-infinite__scroll-view.table.fixed": {
    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__page": {
        " .list-item": {
          maxHeight: "36px"
        }
      },
      " .github": {
        height: "133px"
      }
    }
  }
}];

addStyle("fixed", styles$6);

var item$4 = function item(data, opts) {
  return m(".list-item", [m("div", opts.page), m("div", data || m.trust("&nbsp;"))]);
};

var PAGE_COUNT = 20;
var PAGE_ITEMS = 20;
var ITEM_HEIGHT = 36 + 1; // include border
var AFTER_CONTENT_HEIGHT = 133;

var component$4 = {};
component$4.view = function () {
  var scrollHeight = PAGE_COUNT * PAGE_ITEMS * ITEM_HEIGHT + AFTER_CONTENT_HEIGHT;
  return m(infinite, {
    maxPages: PAGE_COUNT,
    item: item$4,
    pageUrl: function pageUrl(page) {
      return "data/fixed/page-" + page + ".json";
    },
    class: "table fixed",
    // set the size of each page
    pageSize: function pageSize() {
      return PAGE_ITEMS * ITEM_HEIGHT;
    },
    // set the total height
    contentSize: scrollHeight,
    after: github()
  });
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

var IMG_URL$3 = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

var item$5 = function item(data) {
  return m("a.grid-item", m(".image-holder", m(".image", {
    config: function config(el, inited, context) {
      if (context.inited) {
        return;
      }
      el.style.backgroundImage = "url(" + IMG_URL$3 + data.src + ")";
    }
  })));
};

var component$5 = {};
component$5.controller = function () {
  var getData = function getData(page) {
    return m.request({
      method: "GET",
      url: "data/grid/page-" + page + ".json"
    });
  };
  var pageCount = m.prop();
  var page = m.route.param("page") ? parseInt(m.route.param("page"), 10) : 1;
  var pageNum = m.prop(page);
  var pageData = function pageData(pageNum) {
    return getData(pageNum).then(function (response) {
      pageCount(response.length);
      return response;
    });
  };

  return {
    pageData: pageData,
    pageCount: pageCount,
    pageNum: pageNum,
    hasPrev: function hasPrev() {
      return pageNum() > 1;
    },
    hasNext: function hasNext() {
      return pageNum() !== pageCount();
    }
  };
};
component$5.view = function (ctrl) {
  var pageNum = m.route.param("page") ? parseInt(m.route.param("page"), 10) : ctrl.pageNum();

  return m("div", [m(".paging", [m(".count", "Page " + pageNum), m(infinite, {
    item: item$5, // draws one item
    pageData: ctrl.pageData, // fetches data
    pageChange: ctrl.pageNum,
    currentPage: pageNum,
    autoSize: false // disabled because we are already setting the height in CSS
  }), m(".pager", [m("a", {
    class: !ctrl.hasPrev() ? "disabled" : "",
    href: "/paging?page=" + (pageNum - 1),
    config: m.route
  }, "Prev"), m("a", {
    class: !ctrl.hasNext() ? "disabled" : "",
    href: "/paging?page=" + (pageNum + 1),
    config: m.route
  }, "Next")])]), github()]);
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
    minWidth: vars.size_px
  },
  " h1": {
    display: "block",
    margin: "40px auto 0 auto",
    width: "320px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "normal",
    color: vars.text_color
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
var menuWidthPx = vars.size_px;

var indexStyle = [{
  ".index": {
    " h1": {
      display: "block",
      margin: "40px auto 0 auto",
      width: vars.size + "px",
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "normal",
      color: vars.text_color
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
  href: "/horizontal",
  title: "Horizontal",
  subtitle: "Horizontal scroller"
}, {
  href: "/fixed",
  title: "Fixed height",
  subtitle: "Preset the scroll height, don\"t update scroll height"
}, {
  href: "/paging",
  title: "Paging",
  subtitle: "Prev/Next buttons instead of infinite scroll"
}];

var menu = m("ul.menu", [m("li.header", "Examples"), menuData.map(function (menuItem) {
  return m("li", m("a", {
    href: menuItem.href,
    config: m.route
  }, [m("span.title", menuItem.title), m("span.subtitle", menuItem.subtitle)]));
})]);

var app = {};
app.view = function () {
  return m(".index", [m("h1", "Infinite Scroll for Mithril"), menu, github({
    home: true
  })]);
};

m.route.mode = "hash";
var mountNode = document.querySelector("#app");
m.route(mountNode, "/", {
  "/": app,
  "/images": component,
  "/grid": component$1,
  "/table": component$2,
  "/short": short,
  "/horizontal": component$3,
  "/fixed": component$4,
  "/paging": component$5
});

// Debounce window resize
var resizeTimer = 0;
window.onresize = function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(m.redraw, RESIZE_TIMER);
};
