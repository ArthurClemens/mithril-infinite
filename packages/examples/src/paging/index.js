import m from "mithril";
import { github } from "../app/github";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("paging", styles);

const IMG_URL = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

const item = data => {
  return m("a.grid-item",
    m(".image-holder",
      m(".image", {
        config: (el, inited, context) => {
          if (context.inited) {
            return;
          }
          el.style.backgroundImage = "url(" + IMG_URL + data.src + ")";
        }
      })
    )
  );
};

const getData = page =>
  m.request({
    method: "GET",
    url: "data/grid/page-" + page + ".json"
  });

const component = {};

component.controller = () => {
  let pageCount = 0;
  const pageNum = m.route.param("page")
    ? parseInt(m.route.param("page"), 10)
    : 1;
  
  const pageData = p => 
    getData(p).then((response) => (
      pageCount = response.length,
      response
    ));

  return {
    pageData,
    pageNum,
    hasPrev: () => pageNum > 1,
    hasNext: () => pageNum !== pageCount
  };
};
component.view = (ctrl) => {
  const pageNum = m.route.param("page")
    ? parseInt(m.route.param("page"), 10)
    : ctrl.pageNum;

  return m("div", [
    m(".paging", [
      m(".count", `Page ${pageNum}`),
      m(infinite, {
        item: item, // draws one item
        pageData: ctrl.pageData, // fetches data
        pageChange: pageNum => ctrl.pageNum = pageNum,
        currentPage: pageNum,
        autoSize: false // disabled because we are already setting the height in CSS
      }),
      m(".pager", [
        m("a", {
          class: !ctrl.hasPrev() ? "disabled" : "",
          href: "/paging?page=" + (pageNum - 1),
          config: m.route
        }, "Prev"),
        m("a", {
          class: !ctrl.hasNext() ? "disabled" : "",
          href: "/paging?page=" + (pageNum + 1),
          config: m.route
        }, "Next")
      ])
    ]),
    github()
  ]);
};

export default component;