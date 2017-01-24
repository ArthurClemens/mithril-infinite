import m from "mithril";
import { github } from "../app/github";
import { default as infinite } from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("grid", styles);

const IMG_URL = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

const showImage = (el, imgUrl) => {
  const url = IMG_URL + imgUrl;
  const populate = () => {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
  };
  let img = new Image();
  img.onload = () => {
    populate();
  };
  img.src = url;
};

const item = (data) => {
  return m("a.grid-item",
    m(".image-holder",
      m(".image", {
        config: (el, inited, context) => {
          if (context.inited) {
            return;
          }
          if (infinite.isElementInViewport({ el })) {
            showImage(el, data.src);
            context.inited = true;
          }
        }
      })
    )
  );
};

export default {
  view: () => 
    m(infinite, {
      maxPages: 16, // pages of 12 items each
      preloadPages: 3,
      item: item,
      pageUrl: page => "data/grid/page-" + page + ".json",
      class: "grid",
      pageChange: page => {
        if (console) {
          console.log("page", page); // eslint-disable-line no-console
        }
      },
      after: github()
    })
};
