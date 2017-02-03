import m from "mithril";
import { github } from "../app/github";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("table", styles);

const item = (data, opts) => {
  return m(".list-item", [
    m("div", opts.page),
    m("div", data || m.trust("&nbsp;"))
  ]);
};

export default {
  view: () =>
    m(infinite, {
      maxPages: 10,
      item,
      pageUrl: page => "data/table/page-" + page + ".json",
      class: "table",
      pageChange: page => {
        if (console) {
          console.log("page", page); // eslint-disable-line no-console
        }
      },
      after: github()
    })
};

