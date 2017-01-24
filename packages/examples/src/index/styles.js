import vars from "../app/variables";

const textColorLight = "#90A4AE";
const indexBlockBackgroundColor = "#CFD8DC";
const indexBlockTextColor = "rgba(0,0,0,.85)";
const indexBlockTextColorLight = "rgba(0,0,0,.4)";
const menuWidthPx = vars.size_px;

export default [{
  ".index": {
    " h1": {
      display: "block",
      margin: "40px auto 0 auto",
      width: vars.size + "px",
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "normal",
      color: vars.text_color
    },
    " .menu": {
      width: menuWidthPx,
      margin: "20px auto",
      padding: "0 0 20px 0",
      listStyle: "none",

      " li": {
        margin: "0 0 1px 0",
        padding: 0,

        "&.header": {
          fontSize: "18px",
          color: textColorLight
        },
        "&.header, a": {
          padding: "20px"
        },
        " a": {
          display: "block",
          textDecoration: "none",
          backgroundColor: indexBlockBackgroundColor,

          " .title": {
            display: "block",
            color: indexBlockTextColor,
            fontSize: "18px",
            lineHeight: 1.4 * 18 + "px"
          },
          " .subtitle": {
            display: "block",
            color: indexBlockTextColorLight,
            fontSize: "14px"
          }
        }
      }
    }
  }
}];