import verge from "verge";
import { classes } from "./classes";

const LEEWAY = 300;

export const getElementSize = (el, axis) => {
  const styles = window.getComputedStyle(el);
  if (axis === "x") {
    const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    return el.scrollWidth + margin;
  } else {
    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    return el.scrollHeight + margin;
  }
};

// el, axis = "y", expand = LEEWAY
export const isElementInViewport = ({el, axis = "y", leeway = LEEWAY}) => {
  return axis === "y"
    ? verge.inY(el, leeway) || verge.inY(el, -leeway)
    : axis === "x"
      ? verge.inX(el, leeway) || verge.inX(el, -leeway)
      : verge.inViewport(el, leeway) || verge.inViewport(el, -leeway);
};

export const makeClassName = pageNum => [
  classes.page,
  pageNum % 2 === 0 ? classes.pageEven : classes.pageOdd
].join(" ");