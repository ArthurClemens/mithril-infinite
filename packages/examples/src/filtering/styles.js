const searchBarHeight = 60;

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
      background: "#f5f5f5",
      borderBottom: "1px solid rgba(0, 0, 0, .07)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",

      " input": {
        width: "100%",
        padding: ".5rem 1rem",
        fontSize: "16px",
        outline: "none",
        border: "1px solid #ccc",
      }
    },

    " .mithril-infinite__pages": {
      paddingTop: `${searchBarHeight}px`,
    },

    " .mithril-infinite__scroll-content": {
      " .mithril-infinite__page": {
        display: "table",
        width: "100%",
        backgroundColor: "#fff",

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
