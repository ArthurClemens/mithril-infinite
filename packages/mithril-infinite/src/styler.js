import J2c from "j2c";
const j2c = new J2c();

/*
 * @param id: identifier, used as HTMLElement id for the attached <style></style> element
 * @param styles: list of lists style Objects
 */
export const addStyle = (id, ...styles) => {
  removeStyle(id);
  const styleEl = document.createElement("style");
  if (id) {
    styleEl.setAttribute("id", id);
  }
  styles.forEach((styleList) => {
    // each style returns a list
    if (Object.keys(styleList).length) {
      styleList.forEach((style) => {
        const scoped = { "@global": style };
        const sheet = j2c.sheet(scoped);
        styleEl.appendChild(document.createTextNode(sheet));
      });
    }
  });
  document.head.appendChild(styleEl);
};

const removeStyle = id => {
  if (id) {
    const old = document.getElementById(id);
    if (old) {
      old.parentNode.removeChild(old);
    }
  }
};