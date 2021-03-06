import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";
import { appVariables } from "../app/variables";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("images", styles);

const pageUrl = pageNum =>
  `data/images/page-${pageNum}.json`;

const vm = {
  expanded: {},
  dirty: {},
  toggle: id => {
    if (vm.expanded[id]) {
      delete vm.expanded[id];
    } else {
      vm.expanded[id] = 1;
    }
    vm.dirty[id] = 1;
  },
  isExpanded: id => vm.expanded[id],
  isDirty:    id => vm.dirty[id],
  clearDirty: id => delete vm.dirty[id]
};

const maybeUpdate = (dom, id, src) => {
  if (!vm.isDirty(id)) {
    return;
  }
  if (infinite.isElementInViewport({ el: dom })) {
    const url = appVariables.imageUrl + src;
    dom.style.backgroundImage = dom.style.backgroundImage = "url(" + url + ")";
    vm.clearDirty(id);
  }
};

const item = (data, opts) => {
  const id = opts.pageNum + data.width + data.src;
  const isExpanded = vm.isExpanded(id);
  const heightFraction = isExpanded ? 0.5 : 0.25;
  const width = parseInt(data.width * heightFraction, 10);
  const height = parseInt(data.height * heightFraction, 10);
  return m("a.list-item",
    {
      style: { height: height + "px" },
      onclick: () => vm.toggle(id)
    }, [
      m("span.pageNum", opts.pageNum),
      m(".image", {
        style: { height: height + "px", width: width + "px" },
        oncreate: ({ dom }) => (
          vm.dirty[id] = true,
          maybeUpdate(dom, id, data.src)
        ),
        onupdate: ({ dom }) => maybeUpdate(dom, id, data.src)
      }),
      // minus or plus sign
      m(".toggle", isExpanded ? m.trust("&#150;") : m.trust("&#43;"))
    ]
  );
};

export default {
  oninit: vnode => {
    vnode.state.currentPage = undefined;
  },
  view: vnode =>
    m(infinite, {
      maxPages: 20,
      item,
      pageUrl,
      preloadPages: 3,
      currentPage: vnode.state.currentPage,
      class: "images",
      // processPageData: (content, options)  => {
      //   return m(".my-page", content.map((data, index) => item(data, options, index)));
      // },
      before: m("a",
        {
          class: [
            "list-item",
            vm.isExpanded("before") ? "open" : "closed"
          ].join(" "),
          onclick: () => vm.toggle("before")
        },
        [
          m("div", m.trust("A list of pugs.")),
          m("a", {
            href: "#",
            onclick: e => {
              e.preventDefault();
              vnode.state.currentPage = 6;
              m.redraw();
              setTimeout(() => {
                document.querySelector("[data-page='000006']").scrollIntoView();
                vnode.state.currentPage = undefined;
              }, 1000);
            }
          }, "Go to page 6"),
          m(".toggle", vm.isExpanded("before") ? m.trust("&#150;") : m.trust("&#43;"))
        ]
      ),
      after: footer()
    })
};

