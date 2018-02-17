const searchBarHeight = 54;

export default [{
  ".mithril-infinite__scroll-view.filtering": {
    minWidth: "320px",
    margin: "0 auto",
    background: "#eee",

    " .search-view": {
      padding: "8px 16px",
      height: `${searchBarHeight}px`,
      position: "fixed",
      width: "100%",
      background: "#eee",

      " input": {
        width: "100%",
        padding: ".5rem 1rem",
        fontSize: "16px",
        outline: "none"
      }
    },

    " .mithril-infinite__pages": {
      paddingTop: `${searchBarHeight}px`,
    },

    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__page": {
        display: "table",
        width: "100%"
      },
      " .mithril-infinite__page--odd": {
        backgroundColor: "#e4e4e4",

        " .list-item": {
          " > div": {
            color: "rgba(0,0,0,.87)",
            borderBottom: "1px solid rgba(0, 0, 0, .07)",

            ":first-child": {
              color: "rgba(0,0,0,.54)"
            }
          }
        }
      },
      " .mithril-infinite__page--even": {
        "background-color": "#f0f0f0"
      },
      " .list-item": {
        width: "100%",
        display: "table-row",

        " > div": {
          borderBottom: "1px solid rgba(0, 0, 0, .07)",
          display: "table-cell",
          verticalAlign: "top",
          padding: "8px 16px",
          minHeight: "1em",
          width: "90%",

          ":first-child": {
            color: "#aaa",
            width: "10%",
            textAlign: "right"
          }
        }
      }
    }
  }
}];
