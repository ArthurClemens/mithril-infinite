import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";
import stream from "mithril/stream";
import faker from "faker";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("filtering", styles);

const createName = () =>
  faker.name.findName();

const nameCount = 500;
const data = Array.from(new Array(nameCount), createName).sort();

const pageSize = 10;
const query = stream("");
const getIndex = pageNum => (pageNum - 1) * pageSize;

const item = (data, opts, itemIndex) => {
  return m(".list-item", [
    m("div", getIndex(opts.pageNum) + itemIndex + 1),
    m("div", data || m.trust("&nbsp;"))
  ]);
};

const Search = {
  view: () => {
    return m(".search-view", 
      m("input", {
        oninput: e => query(e.target.value),
        value: query(),
        placeholder: "Search name",
      })
    );
  }
};

const filtered = (arr, queryStr) =>
  arr.filter(item => new RegExp(`\\b${queryStr}`, "gi").test(item));

export default {
  view: () => {
    const queryStr = query();
    const filteredList = queryStr.length > 0
      ? filtered(data, queryStr)
      : data;
    return data
      ? m(infinite, {
        maxPages: Math.ceil(filteredList.length / pageSize),
        preloadPages: 3,
        item,
        pageData: pageNum => {
          const index = getIndex(pageNum);
          return filteredList.slice(index, index + pageSize);
        },
        pageKey: pageNum => `${pageNum}-${queryStr}`, // required to keep redraws working well
        class: "filtering",
        before: m(Search),
        after: footer(),
      })
      : null;
  }
};

