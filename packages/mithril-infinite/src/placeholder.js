import m from "mithril";
import { makeClassName } from "./util";
import { classes } from "./classes";

export const placeholder = {
  oninit: vnode =>
    // Memoize some properties that do not change
    vnode.state.className = makeClassName(vnode.attrs.pageNum),
  view: ({ state, attrs }) => {
    const pageId = attrs.pageId;
    const storedPageSize = attrs.pageSizes[pageId] || 0;

    return m("div", {
      "data-page": pageId,
      class: [
        classes.placeholder,
        state.className
      ].join(" "),
      style: Object.assign(
        {},
        attrs.axis === "x"
          ? { width:  storedPageSize + "px" }
          : { height: storedPageSize + "px" }
      )
    });
  }
};
