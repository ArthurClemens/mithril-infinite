const gridSpacing = 8;
const pageWidth = 320;
const itemSize = (320 - 2 * gridSpacing) / 3;
const imageHolderPadding = 10;
const imageHolderPaddingPx = imageHolderPadding + "px";

export default [{
  ".paging": {
    width: pageWidth + "px",
    margin: "0 auto",

    " .mithril-infinite__scroll-view.mithril-infinite__scroll-view--y": {
      height: (itemSize * 4) + (gridSpacing * 3) + (2 * gridSpacing) + "px"
    },
    " .mithril-infinite__scroll-content": {
      margin: "0 auto",
      width: pageWidth + "px",
      padding: gridSpacing + "px 0 0",

      " .mithril-infinite__content": {
        margin: "0 auto",
        fontSize: 0,
        lineHeight: 0,

        " .mithril-infinite__page": {
          margin: "0 " + (-gridSpacing / 2) + "px"
        },
        " .grid-item": {
          display: "inline-block",
          height: itemSize + "px",
          width: itemSize + "px",
          backgroundColor: "#f0f0f0",
          margin: [0, gridSpacing / 2, gridSpacing, gridSpacing / 2].map((v) => (v + "px")).join(" "),

          " .image-holder": {
            height: itemSize - 2 * imageHolderPadding + "px",
            width: itemSize - 2 * imageHolderPadding + "px",
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
    },
    " .count": {
      fontSize: "14px",
      lineHeight: 1,
      padding: "20px 0 10px 0",
      borderBottom: "1px solid #ddd",
    },
    " .pager": {
      borderTop: "1px solid #ddd",
      padding: "8px 0",
      width: pageWidth + "px",

      " a": {
        display: "inline-block",
        background: "#e0e0e0",
        color: "#333",
        padding: "10px 15px",
        textAlign: "center",
        fontSize: "15px",
        lineHeight: 1,
        margin: "0 5px 0 0",

        "&.disabled": {
          color: "#aaa",
          background: "#f4f4f4",
          pointerEvents: "none"
        }
      }
    }

  }
}];