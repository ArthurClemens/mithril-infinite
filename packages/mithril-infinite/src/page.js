import m from "mithril";
import { getElementSize, makeClassName } from "./util";

const getPageData = url => {
  return m.request({
    method: "GET",
    url,
    initialValue: [],
    background: true
  });
};

export const page = {};

page.controller = (opts = {}) => {
  const pageNum = opts.pageNum;
  let content = m.prop([]);
  if (opts.pageData) {
    const result = opts.pageData(pageNum);
    if (result.then) {
      // A Promise
      result.then((r) => {
        content(r);
        m.redraw();
      });
    } else {
      content = result;
    }
  } else if (opts.pageUrl) {
    const url = opts.pageUrl(pageNum);
    getPageData(url).then(data => (
      content(data),
      m.redraw()
    ));
  }

  return {
    content,
    // Memoize some properties that do not change
    className: makeClassName(pageNum),
    pageTag: opts.pageTag || "div"
  };
};

page.view = (ctrl, opts = {}) => {
  const pageId = opts.pageId;
  const storedPageSize = opts.pageSizes[pageId] || 0;

  // pageSize overrides all measurements on elements here
  let pageSize = 0;
  if (opts.pageSize) {
    pageSize = opts.pageSize(ctrl.content());
    opts.updatePageSize(pageId, pageSize);
  }
  const cssSize = pageSize
    ? pageSize + "px"
    : !opts.autoSize || (opts.isScrolling && storedPageSize)
      ? storedPageSize + "px"
      : "auto";
  const processPageData = opts.processPageData || ((content, opts1) =>
    content
      ? content.map((data, index) => opts.item(data, opts1, index))
      : null
  );

  return m(ctrl.pageTag, {
    "data-page": pageId,
    class: ctrl.className,
    style: storedPageSize
      ? Object.assign(
        {},
        opts.axis === "x"
          ? { width: cssSize }
          : { height: cssSize }
      )
      : {},
    config: pageSize
      ? null
      : el => {
        // always update the natural size
        const size = getElementSize(el, opts.axis);
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


