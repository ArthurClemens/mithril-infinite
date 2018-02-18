import m from "mithril";
import footer from "../app/footer";

import images from "../images";
import grid from "../grid";
import table from "../table";
import short from "../short";
import horizontal from "../horizontal";
import fixed from "../fixed";
import paging from "../paging";
import filtering from "../filtering";

import { addStyle } from "../app/styler";
import commonStyle from "../app/common-style";
import indexStyle from "./styles";
addStyle("common", commonStyle);
addStyle("index", indexStyle);

const RESIZE_TIMER = 500;

const menuData = [
  {
    href: "/images",
    title: "Images",
    subtitle: "200 images of various heights"
  },
  {
    href: "/horizontal",
    title: "Horizontal",
    subtitle: "Horizontal scroller"
  },
  {
    href: "/grid",
    title: "Image grid",
    subtitle: "Responsive grid with 1, 2, 3 and 4 columns"
  },
  {
    href: "/table",
    title: "Data table",
    subtitle: "Table rows of various heights"
  },
  {
    href: "/filtering",
    title: "Dynamic data",
    subtitle: "Filter infinite results"
  },
  {
    href: "/short",
    title: "Short content",
    subtitle: "Automatically finds loadable space"
  },
  {
    href: "/fixed",
    title: "Fixed height",
    subtitle: "Preset the scroll height, don't update scroll height"
  },
  {
    href: "/paging",
    title: "Paging",
    subtitle: "Previous / Next buttons instead of infinite scroll"
  }
];

const menu = m("ul.menu", [
  m("li.header", "Examples"),
  menuData.map(menuItem => {
    return m("li", m("a", {
      href: menuItem.href,
      oncreate: m.route.link
    }, [
      m("span.title", menuItem.title),
      m("span.subtitle", menuItem.subtitle)
    ]));
  })
]);

const app = {
  view: () => {
    return m(".index", [
      m("h1", "Infinite Scroll for Mithril"),
      menu,
      footer({
        home: true
      })
    ]);
  }
};

const mountNode = document.querySelector("#app");
m.route(mountNode, "/", {
  "/": app,
  "/images": images,
  "/grid": grid,
  "/table": table,
  "/filtering": filtering,
  "/short": short,
  "/horizontal": horizontal,
  "/fixed": fixed,
  "/paging": paging,
  "/paging/:p": paging
});

// Debounce window resize
let resizeTimer = 0;
window.onresize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(m.redraw, RESIZE_TIMER);
};
