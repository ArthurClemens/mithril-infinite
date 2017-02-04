import { styleVariables } from "./variables";

const styles = [{
  " *": {
    "box-sizing": "border-box"
  },
  " html, body, #app": {
    minHeight: "100%",
    height: "100%"
  },
  " body": {
    margin: 0,
    padding: 0,
    fontFamily: "arial, sans-serif",
    minWidth: styleVariables.size_px
  },
  " h1": {
    display: "block",
    margin: "40px auto 0 auto",
    width: "320px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "normal",
    color: styleVariables.text_color
  },
  " a": {
    "&:link, &:visited": {
      color: "#1E88E5",
      textDecoration: "none"
    }
  }
}];
export default styles;