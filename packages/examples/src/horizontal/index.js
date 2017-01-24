import m from "mithril";
import { github } from "../app/github";
import { default as infinite } from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("horizontal", styles);

const IMG_URL = "http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/";

// fade in first time only
const fadeInImage = (el, imgUrl) => {
  const url = IMG_URL + imgUrl;
  const showImage = () => {
    el.style.backgroundImage = "url(" + url + ")";
    el.style.opacity = 1;
  };
  let img = new Image();
  img.onload = () => {
    showImage();
  };
  img.src = url;
};

const item = data =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        config: (el, inited, context) => {
          if (context.inited) {
            return;
          }
          if (infinite.isElementInViewport({ el })) {
            fadeInImage(el, data.src);
            context.inited = true;
          }
        }
      })
    )
  );

export default {
  view: () =>
    [
      m(infinite, {
        maxPages: 16,
        item: item,
        pageUrl: page => "data/horizontal/page-" + page + ".json",
        class: "horizontal",
        axis: "x",
        pageSize: (content) => (content.length || 12) * (210 + 2 * 4), // values from CSS including margins
        pageChange: page => {
          if (console) {
            console.log("page", page); // eslint-disable-line no-console
          }
        }
      }),
      github()
    ]
};

