const grid_spacing = 8;
const item_size = 210;
const item_size_px = item_size + "px";
const image_padding = 10;
const image_padding_px = image_padding + "px";

export default [{
  ".mithril-infinite__scroll-view.horizontal": {
    margin: 0,
    height: item_size + 20 + "px", // add space for scrollbar
    background: "#fff",

    " .mithril-infinite__scroll-content": {
      padding: 0,
      margin: 0,
      fontSize: 0,

      " .mithril-infinite__content, .mithril-infinite__padding-before, .mithril-infinite__padding-after": {
        display: "inline-block"
      },
      " .mithril-infinite__content": {
        margin: 0,
        fontSize: 0,

        " .mithril-infinite__page": {
          display: "inline-block",
          height: item_size_px
        },

        " .grid-item": {
          display: "inline-block",
          height: item_size_px,
          width: item_size_px,
          backgroundColor: "#f0f0f0",
          margin: "0 " + (grid_spacing / 2) + "px",

          " .image-holder": {
            height: item_size - 2 * image_padding + "px",
            width: item_size - 2 * image_padding + "px",
            overflow: "hidden",
            position: "relative",
            margin: image_padding_px,

            " .image": {
              position: "absolute",
              left: "auto",
              top: 0,
              right: "auto",
              bottom: 0,
              width: "100%",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "50%",
              opacity: 0,
              transition: "opacity .7s"
            }
          }
        }
      }
    }
  }
}];