import m from "mithril";
import { addStyle } from "../app/styler";
import { styleVariables } from "../app/variables";

const SIDE_PADDING = 16;
const VERSION = "1.0.0";

const styles = [{
  ".footer": {
    width: (styleVariables.size - 2 * SIDE_PADDING) + "px",
    margin: "32px auto 0 auto",
    textAlign: "left",
    padding: "24px " + SIDE_PADDING + "px",
    fontSize: "14px",
    lineHeight: 1.3,
    color: "#90A4AE",
    opacity: ".85",

    " hr": {
      height: "1px",
      border: "none",
      margin: "1em -" + SIDE_PADDING + "px",
      backgroundColor: "#CFD8DC",
      opacity: ".85"
    }
  }
}];

addStyle("footer", styles);

export default (opts = {}) =>
  m(".footer", [!opts.home ? m("a",
    {
      href: "/",
      oncreate: m.route.link
    }, "All examples") : null,
    m("hr"),
    m.trust(`mithril-infinite, Infinite Scroll for Mithril on mobile and desktop. This site runs on version ${VERSION}. Project page on <a href=\"https://github.com/ArthurClemens/mithril-infinite\">Github</a>.`)
  ]);