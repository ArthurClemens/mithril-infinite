import m from "mithril";
import { github } from "../app/github";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("fixed", styles);

const PAGE_COUNT =           20;
const PAGE_ITEMS =           20;
const ITEM_HEIGHT =          36 + 1; // include border
const AFTER_CONTENT_HEIGHT = 133;

let item = (data, opts) => {
  return m(".list-item", [
    m("div", opts.pageNum),
    m("div", data || m.trust("&nbsp;"))
  ]);
};

export default {
  controller: () => ({
    scrollHeight: PAGE_COUNT * PAGE_ITEMS * ITEM_HEIGHT + AFTER_CONTENT_HEIGHT
  }),
  view: ctrl => {
    return m(infinite, {
      maxPages: PAGE_COUNT,
      item: item,
      pageUrl: page => "data/fixed/page-" + page + ".json",
      class: "table fixed",
      // set the size of each page
      pageSize: () => (PAGE_ITEMS * ITEM_HEIGHT),
      // set the total height
      contentSize: ctrl.scrollHeight,
      after: github()
    });
  }
};
