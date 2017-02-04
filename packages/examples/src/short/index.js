import m from "mithril";
import infinite from "mithril-infinite";
import footer from "../app/footer";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("short", styles);

const item = data => {
  const color = data[1] || "transparent";
  const title = data[1] ? "" : m(".title", data[0]);
  return m(".list-item", {
    class: title ? "has-title" : "",
    style: { "background-color": color }
  }, title);
};

export default {
  view: () =>
    m(infinite, {
      item,
      maxPages: 21,
      preloadSlots: 10,
      pageUrl: page => "data/short/page-" + page + ".json",
      class: "short",
      pageChange: page => {
        if (console) {
          console.log("page", page); // eslint-disable-line no-console
        }
      },
      after: footer()
    })
};
