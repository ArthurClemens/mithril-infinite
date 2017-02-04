import m from "mithril";
import prop from "mithril/stream";
import { getElementSize, makeClassName } from "./util";

const getPageData = url =>
  m.request({
    method: "GET",
    url
  });

const oninit = ({ state, attrs }) => {
  const pageNum = attrs.pageNum;
  let content = prop([]);
  if (attrs.pageData) {
    const result = attrs.pageData(pageNum);
    if (result.then) {
      // A Promise
      result.then(content);
    } else {
      content = result;
    }
  } else if (attrs.pageUrl) {
    const url = attrs.pageUrl(pageNum);
    getPageData(url).then(content);
  }

  const processPageData = attrs.processPageData || ((content, attrs1) =>
    content && content.length
      ? content.map((data, index) => attrs.item(data, attrs1, index))
      : null
  );

  state.content = content;
  // Memoize some properties that do not change
  state.className = makeClassName(pageNum);
  state.pageTag = attrs.pageTag || "div";
  state.processPageData = processPageData;
};

const view = ({state, attrs}) => {
  const pageId = attrs.pageId;
  const storedPageSize = attrs.pageSizes[pageId] || 0;
  let pageSize = 0;

  // attrs/pageSize overrides all measurements on elements here
  if (attrs.pageSize) {
    pageSize = attrs.pageSize(state.content());
    attrs.updatePageSize(pageId, pageSize);
  }

  const cssSize = pageSize
    ? pageSize + "px"
    : !attrs.autoSize || (attrs.isScrolling && storedPageSize)
      ? storedPageSize + "px"
      : "auto";
  const update = dom => {
    if (pageSize) return;
    const size = getElementSize(dom, attrs.axis);
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
    style: storedPageSize
      ? attrs.axis === "x"
        ? { width: cssSize }
        : { height: cssSize }
      : null,
    oncreate: ({ dom }) => update(dom),
    onupdate: ({ dom }) => update(dom)
  }, state.processPageData(state.content(), {
    isScrolling: attrs.isScrolling,
    pageId: attrs.pageId,
    pageNum: attrs.pageNum
  }));
};

export const page = {
  oninit,
  view
};
