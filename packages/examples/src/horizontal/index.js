import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";
import { appVariables } from "../app/variables";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("horizontal", styles);

const loadImage = (el, imgUrl) => {
  const url = appVariables.imageUrl + imgUrl;
  const populate = () => {
    el.style.backgroundImage = `url(${url})`;
    el.style.opacity = 1;
  };
  let img = new Image();
  img.onload = populate;
  img.src = url;
};

const maybeLoadImage = (vnode, data) => {
  if (vnode.state.inited) {
    return;
  }
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    loadImage(vnode.dom, data.src);
    vnode.state.inited = true;
  }
};

const item = data =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        oncreate: vnode => maybeLoadImage(vnode, data)
      })
    )
  );

export default {
  view: () =>
    [
      m(infinite, {
        maxPages: 16,
        item,
        pageUrl: pageNum => "data/horizontal/page-" + pageNum + ".json",
        class: "horizontal",
        axis: "x",
        pageSize: content => (content.length || 12) * (210 + 2 * 4), // values from CSS including margins
        pageChange: pageNum => {
          if (console) {
            console.log("page", pageNum); // eslint-disable-line no-console
          }
        }
      }),
      footer()
    ]
};

