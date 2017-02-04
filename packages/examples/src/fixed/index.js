/*
This example shows how to get the total page count from a request, and use that to calculate the total content height.
*/
import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("fixed", styles);

const PAGE_ITEMS =           10;
const ITEM_HEIGHT =          36 + 1; // include border
const AFTER_CONTENT_HEIGHT = 133;

const dataUrl = pageNum =>
  `http://jsonplaceholder.typicode.com/posts?_start=${(pageNum - 1) * PAGE_ITEMS}&_end=${pageNum * PAGE_ITEMS}`;

const item = data =>
  m(".list-item", [
    m("div", data.id),
    m("div", data.title)
  ]);

export default {
  oninit: vnode => {
    const state = vnode.state;
    state.pageCount = 1;

    state.pageData = pageNum => 
      m.request({
        method: "GET",
        dataType: "jsonp",
        url: dataUrl(pageNum),
        extract: xhr => (
          // Read the total count from the header
          state.pageCount = Math.ceil(parseInt(xhr.getResponseHeader("X-Total-Count"), 10) / PAGE_ITEMS),
          JSON.parse(xhr.responseText)
        )
      });
  },
  view: ({ state }) => {
    return m(infinite, {
      pageData: state.pageData,
      maxPages: state.pageCount,
      preloadPages: 3,
      item,
      class: "table fixed",
      // set the size of each page
      pageSize: () => PAGE_ITEMS * ITEM_HEIGHT,
      // set the total height
      contentSize: state.pageCount * PAGE_ITEMS * ITEM_HEIGHT + AFTER_CONTENT_HEIGHT,
      after: footer()
    });
  }
};
