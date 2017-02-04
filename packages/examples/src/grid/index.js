import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("grid", styles);

const PAGE_ITEMS = 12;
const IMAGE_SIZE = 190;

const loadImage = (el, imgUrl) => {
  const url = imgUrl.replace(/\/150\//, `/${IMAGE_SIZE}/`);
  const populate = () => {
    el.style.backgroundImage = `url(${url})`;
    el.style.opacity = 1;
  };
  let img = new Image();
  img.onload = populate;
  img.src = imgUrl;
};

const maybeLoadImage = (vnode, data) => {
  if (vnode.state.inited) {
    return;
  }
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    loadImage(vnode.dom, data.thumbnailUrl);
    vnode.state.inited = true;
  }
};

const item = data =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        oncreate: vnode => maybeLoadImage(vnode, data),
        onupdate: vnode => maybeLoadImage(vnode, data)
      })
    )
  );

const dataUrl = pageNum =>
  `http://jsonplaceholder.typicode.com/photos?_start=${(pageNum - 1) * PAGE_ITEMS}&_end=${pageNum * PAGE_ITEMS}`;

const pageData = pageNum => 
  m.request({
    method: "GET",
    dataType: "jsonp",
    url: dataUrl(pageNum)
  });

export default {
  view: () => 
    m(infinite, {
      preloadPages: 3,
      item,
      pageData,
      class: "grid",
      after: footer()
    })
};
