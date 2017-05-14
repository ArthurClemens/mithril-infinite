const gridSpacing = 8;
const itemWidth = 210;
const itemWidthPx = itemWidth + "px";
const imageHolderPadding = 10;
const imageHolderPaddingPx = imageHolderPadding + "px";

const makeMediaStyle = function(which, cols) {
  return {
    ["@media (" + which + "-width: " + ((cols + 1) * itemWidth + cols * gridSpacing) + "px)"]: {
      ".mithril-infinite__scroll-view.grid": {
        " .mithril-infinite__scroll-content": {
          " .mithril-infinite__content": {
            "width": cols * itemWidth + (cols - 1) * gridSpacing + "px"
          }
        }
      }
    }
  };
};

export default [
  makeMediaStyle("min", 4),
  makeMediaStyle("max", 4),
  makeMediaStyle("max", 3),
  makeMediaStyle("max", 2),
  makeMediaStyle("max", 1), {
    ".mithril-infinite__scroll-view.grid": {
      margin: "0 auto",

      " .mithril-infinite__scroll-content": {
        padding: 2 * gridSpacing + "px 0",

        " .mithril-infinite__content": {
          margin: "0 auto",
          fontSize: 0,
          lineHeight: 0,

          " .mithril-infinite__page": {
            margin: "0 " + (-gridSpacing / 2) + "px"
          },
          " .grid-item": {
            display: "inline-block",
            height: itemWidthPx,
            width: itemWidthPx,
            backgroundColor: "#f0f0f0",
            margin: [0, gridSpacing / 2, gridSpacing, gridSpacing / 2].map((v) => (v + "px")).join(" "),

            " .image-holder": {
              height: itemWidth - 2 * imageHolderPadding + "px",
              width: itemWidth - 2 * imageHolderPadding + "px",
              overflow: "hidden",
              position: "relative",
              margin: imageHolderPaddingPx,

              " .image": {
                position: "absolute",
                left: "auto",
                top: 0,
                right: "auto",
                bottom: 0,
                width: "100%",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPositionX: "50%"
              }
            }
          }
        }
      }
    }
  }
];
