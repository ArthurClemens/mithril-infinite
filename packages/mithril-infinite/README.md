# Infinite Scroll for Mithril on mobile and desktop

Compatible with Mithril 1.0.

## Examples

[Examples](https://github.com/ArthurClemens/mithril-infinite/tree/master/packages/examples)


## Features

* Natural scrolling using browser defaults
* Fast and fluent (on desktop and modern mobiles)
* Can be used for lists, grids and table-like data.
* Pre-fetches data of the current page, the page before and after.
* Items that are out of sight are removed, so only a fraction of the total content is drawn on the screen. This is good for speed and memory consumption.
* Support for unequal content heights and dynamic resizing of content elements.
* As more data is loaded, the scroll view increases in size, so that the scrollbar can be used to go back to a specific point on the page.
* Items are handled per "page", which is a normal way of handling batches of search results from the server.
* Pages can contain an arbitrary and unequal amount of items.
* When there is room on the page to show more data: automatic detection of "loadable space" (so no loading area detection div is needed).
* Optionally use previous/next paging buttons

Not included (by design):

* Special support for older mobile browsers: no touch layer, requestAnimationFrame, absolute positioning or speed/deceleration calculations.
* For smooth programmatic scrolling (to a scroll position) a number of scroll libraries exist, for instance [ftcroller](https://github.com/ftlabs/ftscroller).


## Installation

Use as npm module:

~~~bash
npm install --save mithril-infinite
~~~

or download/clone from Github.

For working with the examples, see the [examples documentation](https://github.com/ArthurClemens/mithril-infinite/tree/master/packages/examples).


## Usage

**Note:** The parent of "scroll-view" must have a height. Also make sure that `html` has a height (typically set to `100%`).

### Handling data

Data can be provided:

* With `pageUrl` for referencing URLs
* With `pageData` for server requests


#### Using `pageUrl` for referencing URLs

A example using data files:

~~~javascript
import infinite from "mithril-infinite";

m(infinite, {
  maxPages: 16,
  pageUrl: pageNum => "data/page-" + pageNum + ".json",
  item
});
~~~

With these options we are:

* limiting the number of pages to 16
* passing a function to generate a JSON data URL
* passing a function that should return a Mithril element

A simple item function:

~~~javascript
const item = (data, opts, index) => 
  m(".item", [
    m("h2", data.title),
    m("div", data.body)
  ]);
~~~

The `item` function passes 3 parameters:

1. `data` contains the loaded data from `pageUrl`.
2. `opts` contains: `isScrolling: Bool`, `pageId: String`, `pageNum: Number`, `pageSize: Number`
3. `index`: the item index


#### Data file structure

Data is handled per "results" page. Each page is a JSON data object that contains a list of item data.

You are free to use any data format. Some examples: 

~~~json
[
  {
    "src": "cat.jpg",
    "width": 500,
    "height": 375
  }
]
~~~

Or:

~~~json
[
  ["red", "#ff0000"],
]
~~~


#### Using `pageData` for server requests
 
In most real world situations an API server will provide the data. So while passing file URLs with `pageUrl` is a handy shortcut, we preferably use data requests.


##### With m.request

~~~javascript
import infinite from "mithril-infinite";

const pageData = pageNum => 
  m.request({
    method: "GET",
    dataType: "jsonp",
    url: dataUrl(pageNum)
  });

m(infinite, {
  pageData,
  item
});
~~~

Demo tip: in the example "Grid" we use `jsonplaceholder.typicode.com` to fetch our images:

~~~javascript
const PAGE_ITEMS = 10;

const dataUrl = pageNum =>
  `http://jsonplaceholder.typicode.com/photos?_start=${(pageNum - 1) * PAGE_ITEMS}&_end=${pageNum * PAGE_ITEMS}`;
~~~


##### With `async`

~~~javascript
import infinite from "mithril-infinite";

const asyncPageData = async function(pageNum) {
  try {
    const response = await fetch(dataUrl(pageNum));
    return response.json();
  } catch (ex) {
    //console.log('parsing failed', ex);
  }
};

m(infinite, {
  pageData: asyncPageData,
  item
});
~~~

##### Returning data directly

~~~javascript
import infinite from "mithril-infinite";

const returnData = () =>
  [{ /* some data */ }];

m(infinite, {
  pageData: returnData,
  item
});
~~~

##### Returning data as a Promise

~~~javascript
import infinite from "mithril-infinite";

const returnDelayedData = () =>
  new Promise(resolve =>
    setTimeout(() =>
      resolve(data)
    , 1000)
  );

m(infinite, {
  pageData: returnDelayedData,
  item
});
~~~


### Advanced item function example

To enhance the current loading behavior, we:

* Load images when they are visible in the viewport
* Stop loading images when the page is scrolling. This makes a big difference in performance, but it will not always result in a good user experience - the page will seem "dead" when during the scrolling. So use with consideration.

The `item` function can now look like this:

~~~javascript
const item = (data, opts) =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        oncreate: vnode => maybeShowImage(vnode, data, opts.isScrolling),
        onupdate: vnode => maybeShowImage(vnode, data, opts.isScrolling)
      })
    )
  );

// Don't load the image if the page is scrolling
const maybeShowImage = (vnode, data, isScrolling) => {
  if (isScrolling || vnode.state.inited) {
    return;
  }
  // Only load the image when visible in the viewport
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    showImage(vnode.dom, data.thumbnailUrl);
    vnode.state.inited = true;
  }
el.style.backgroundImage = `url(${url})`;
~~~


### Getting the total page count

How the total page count is delivered will differ per server. `jsonplaceholder.typicode.com` passes the info in the request header.

Example "Fixed" shows how to get the total page count from the request, and use that to calculate the total content height.

We place the `pageData` function in the `oninit` function so that we have easy access to the `state.pageCount` variable:

~~~javascript
const state = vnode.state;
state.pageCount = 1;

state.pageData = pageNum => 
  m.request({
    method: "GET",
    dataType: "jsonp",
    url: dataUrl(pageNum),
    extract: xhr => (
      // Read the total count from the header
      state.pageCount = Math.ceil(parseInt(xhr.getResponseHeader("X-Total-Count"), 10) / PAGE_ITEMS),
      JSON.parse(xhr.responseText)
    )
  });
~~~

Then pass `state.pageData` to `infinite`:

~~~javascript
m(infinite, {
  pageData: state.pageData,
  maxPages: state.pageCount,
  ...
});
~~~


### Using images

For a better loading experience (and data usage), images should be loaded only when they appear on the screen. To check if the image is in the viewport, you can use the function `infinite.isElementInViewport({ el })`. For example:

~~~javascript
if (infinite.isElementInViewport({ el: vnode.dom })) {
  loadImage(vnode.dom, data.thumbnailUrl);
}
~~~

Images should not be shown with the `<img/>` tag: while this works fine on desktop browsers, this causes redrawing glitches on iOS Safari. The solution is to use `background-image`. For example:

~~~javascript
el.style.backgroundImage = `url(${url})`;
~~~



### Using table data

Using `<table>` tags causes reflow problems. Use divs instead, with CSS styling for table features. For example:

~~~css
.page {
  display: table;
  width: 100%;
}
.list-item {
  width: 100%;
  display: table-row;
}
.list-item > div {
  display: table-cell;
}
~~~



### Pagination

See the "Paging" example.



## Configuration options

### Appearance options

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **scrollView** | optional | Selector String | | Pass an element"s selector to assign another element as scrollView |
| **class** | optional | String |  | Extra CSS class appended to `mithril-infinite__scroll-view` |
| **contentTag** | optional | String | "div" | HTML tag for the content element |
| **pageTag** | optional | String | "div" | HTML tag for the page element; note that pages have class `mithril-infinite__page` plus either `mithril-infinite__page--odd` or `mithril-infinite__page--even` |
| **maxPages** | optional | Number | `Number.MAX_VALUE` | Maximum number of pages to draw |
| **preloadPages** | optional | Number | 1 | Number of pages to preload when the app starts; if room is available, this number will increase automatically |
| **axis** | optional | String | "y" | The scroll axis, either "y" or "x" |
| **autoSize** | optional | Boolean | true | Set to `false` to not set the width or height in CSS |
| **throttle** | optional | Number | .2 | The number of seconds between scroll updates |
| **before** | optional | Mithril template or component | | Content shown before the pages; has class `mithril-infinite__before` |
| **after** | optional | Mithril template or component | | Content shown after the pages; has class `mithril-infinite__after`; will be shown only when content exists and the last page is in view (when `maxPages` is defined) |
| **contentSize** | optional | Number (pixels) |  | Use when you know the number of items to display and the height of the content, and when  predictable scrollbar behaviour is desired (without jumps when content is loaded); pass a pixel value to set the size (height or width) of the scroll content, thereby overriding the dynamically calculated height; use together with `pageSize`  |
| **setDimensions** | optional | Function ({scrolled: Number, size: Number}) | | Sets the initial size and scroll position of `scrollView`; this function is called once |

### Callback functions

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **pageUrl** | either `pageData` or `pageUrl` | Function `(page: Number) => String` | | Function that accepts a page number and returns a URL String |
| **pageData** | either `pageData` or `pageUrl` | Function `(page: Number) => Promise` | | Function that fetches data; accepts a page number and returns a promise |
| **item** | required | Function `(data: Array, options: Object, index: Number) => Mithril Template` | | Function that creates a Mithril element from received data |
| **pageSize** | optional | Function `(content: Array) => Number` | Pass a pixel value to set the size (height or width) of each page; the function accepts the page content and returns the size |
| **pageChange** | optional | Function `(page: Number)` | | Get notified when a new page is shown |
| **processPageData** | optional | Function `(data: Array, options: Object) => Array` | | Function that maps over the page data and returns an item for each |
| **getDimensions** | optional | Function `() => {scrolled: Number, size: Number}` | | Returns an object with state dimensions of `scrollView`: `scrolled` (either scrollTop or scrollLeft) and `size` (either height or width); this function is called on each view update | 

### Paging options

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **currentPage**  | optional | Number | | Sets the current page |
| **from** | optional | Number | | Not needed when only one page is shown (use `currentPage`); use page data from this number and higher |
| **to** | optional | Number | | Not needed when only one page is shown (use `currentPage`); Use page data to this number and lower |

### Options for infinite.isElementInViewport

All options are passed in an options object: `infinite.isElementInViewport({ el, leeway })`

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **el** | required | HTML Element | | The element to check |
| **axis** | optional | String | "y" | The scroll axis, either "y" or "x" |
| **leeway** | optional | Number | 300 | The extended area; by default the image is already fetched when it is 100px outside of the viewport; both bottom and top leeway are calculated |



## Styling

Note: The parent of "scroll-view" must have a height. Also make sure that `html` has a height (typically set to `100%`).

Styles are added using [j2c](https://github.com/pygy/j2c). This library is also used in the examples.



## CSS classes

| **Element**           | **Key**       |  **Class** |
| --------------------- | ------------- | --------------- |
| Scroll view           | scrollView    | `mithril-infinite__scroll-view` |
| Scroll content        | scrollContent | `mithril-infinite__scroll-content` |
| Content container     | content       | `mithril-infinite__content` |
| Pages container       | pages         | `mithril-infinite__pages` |
| Page                  | page          | `mithril-infinite__page` |
| Content before        | before        | `mithril-infinite__before` |
| Content after         | after         | `mithril-infinite__after` |

| **State**             | **Key**     |  **Class** |
| --------------------- | ----------- | --------------- |
| Scroll view, x axis   | scrollViewX | `mithril-infinite__scroll-view--x` |
| Scroll view, y axis   | scrollViewY | `mithril-infinite__scroll-view--y` |
| Even numbered page    | pageEven    | `mithril-infinite__page--even` |
| Odd numbered page     | pageOdd     | `mithril-infinite__page--odd` |
| Page, now placeholder | placeholder | `mithril-infinite__page--placeholder` |



## Size

Minified and gzipped: ~ 3.7 Kb



## Dependencies

* [j2c](https://github.com/pygy/j2c) - for creating js stylesheets
* [Mithril 1.0](https://www.npmjs.com/package/mithril)
* [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)
* [Verge](https://www.npmjs.com/package/verge) - for measuring the viewport



## Future improvements

* Smarter handling of "no data found" (works fine if maxPages is set, otherwise gives 404 in console).
* Optimize page load order, for example de-prioritize loading of the previous page.



## Licence

MIT
