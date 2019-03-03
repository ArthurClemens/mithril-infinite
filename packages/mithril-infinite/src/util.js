import verge from "verge";
import { classes } from "./classes";

const LEEWAY = 300;

export const getElementSize = (el, axis) => {
  if (axis === "x") {
    return el.offsetWidth;
  } else {
    return el.offsetHeight;
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