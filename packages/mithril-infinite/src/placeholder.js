import m from "mithril";
import { makeClassName } from "./util";

export const placeholder = {};

placeholder.controller = (opts = {}) => {
  // Memoize some properties that do not change
  return {
    className: makeClassName(opts.pageNum)
  };
};

placeholder.view = (ctrl, opts = {}) => {
  const pageId = opts.pageId;
  const storedPageSize = opts.pageSizes[pageId] || 0;
  return m("div", {
    "data-page": pageId,
    class: ctrl.className,
    style: Object.assign(
      {},
      opts.axis === "x"
        ? { width:  storedPageSize + "px" }
        : { height: storedPageSize + "px" }
    )
  });
};
