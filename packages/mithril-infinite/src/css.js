import { addStyle } from "./styler";
import { classes } from "./classes";

const styles = [{
  ["." + classes.scrollView]: {
    "-webkit-overflow-scrolling": "touch",
    height: "100%",

    [" ." + classes.scrollContent]: {
      overflowAnchor: "none",
    },

    ["&." + classes.scrollViewY]: {
      overflowX: "hidden",
      overflowY: "auto",
      height: "100%",

      [" ." + classes.scrollContent]: {
        height: "100%",
      }
    },

    ["&." + classes.scrollViewX]: {
      overflowX: "auto",
      overflowY: "hidden",
      width: "100%",

      [" ." + classes.scrollContent]: {
        width: "100%"
      }
    }
  }
  // by default unstyled:
  // mithril-infinite__content
  // mithril-infinite__pages
  // mithril-infinite__page
}];

addStyle("mithril-infinite", styles);
