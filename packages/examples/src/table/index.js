import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("table", styles);

const item = (data, opts) => {
  return m(".list-item", [
    m("div", opts.pageNum),
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
      after: footer()
    })
};

