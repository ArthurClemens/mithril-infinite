import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";
import { appVariables } from "../app/variables";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("paging", styles);

const item = data =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        oncreate: ({ dom }) => {
          dom.style.backgroundImage = "url(" + appVariables.imageUrl + data.src + ")";
        }
      })
    )
  );

const getData = pageNum =>
  m.request({
    method: "GET",
    url: "data/paging/page-" + pageNum + ".json"
  });

export default {
  oninit: vnode => {
    let pageCount = 0;
    const pageNum = m.route.param("p")
      ? parseInt(m.route.param("p"), 10)
      : 1;
    
    const getPageData = pageNum =>
      getData(pageNum).then(response => (
        pageCount = response.length,
        response
      ));

    Object.assign(vnode.state, {
      getPageData,
      pageNum,
      hasPrev: num => num > 1,
      hasNext: num => num < pageCount
    });
  },
  view: vnode => {
    const state = vnode.state;
    const pageNum = m.route.param("p")
      ? parseInt(m.route.param("p"), 10)
      : state.pageNum;
    return m("div", [
      m(".paging", [
        m(".count", `Page ${pageNum}`),
        m(infinite, {
          item,
          pageData: state.getPageData,
          pageChange: num => state.pageNum = num,
          currentPage: pageNum,
          autoSize: false // disabled because we are already setting the height in CSS
        }),
        m(".pager", [
          m(m.route.Link, {
            class: !state.hasPrev(pageNum) ? "disabled" : "",
            href: "/paging/" + (pageNum - 1),
          }, "Prev"),
          m(m.route.Link, {
            class: !state.hasNext(pageNum) ? "disabled" : "",
            href: "/paging/" + (pageNum + 1),
          }, "Next")
        ])
      ]),
      footer()
    ]);   
  }
};
