# Infinite Scroll for Mithril on mobile and desktop

Compatible with Mithril 0.2.5.

## Examples

* [Infinite Scroll Examples](http://arthurclemens.github.io/mithril-infinite/index.html)
* [Example with header panel (Polythene)](http://arthurclemens.github.io/Polythene-examples/index.html#/header-panel/infinite)


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

Not included:

* Special support for older mobile browsers: no touch layer, requestAnimationFrame, absolute positioning or speed/deceleration calculations.
* For smooth programmatic scrolling (to a scroll position) a number of scroll libraries exist, for instance [ftcroller](https://github.com/ftlabs/ftscroller).


## Installation

Use as npm module:

~~~bash
npm install mithril-infinite
~~~

or download/clone from Github, `packages/mithril-infinite`.

For working with the examples, see the [Examples README](https://github.com/ArthurClemens/mithril-infinite/packages/examples).


## Usage

Then:

~~~javascript
import infinite from "mithril-infinite";

m(infinite, {
  maxPages: 16,
  pageUrl: function(page) {return "app/data/page-" + page + ".json";},
  item: handlePageItem
});
~~~

We have limited the number of pages to 16, pass a function to generate a JSON data URL, and pass a function that creates an item (Mithril template/component):

~~~javascript
const handlePageItem = (data, opts) => 
  m(".item", [
    m("h2", data.title),
    m("div", opts.pageNum)
  ])
};
~~~

### Custom requests

By default, the resulting URL from `pageUrl` is passed to a `m.request` function. This works for simple cases where data is fetched from the same server. If you need to access another server, this will likely fail. Instead create your own request and pass this with parameter `pageData`:

~~~javascript
const getPageData = page =>
  m.request({
    method: "GET",
    url: "http://mysite.com/data?pageSize=12&page=" + page,
    initialValue: [],
    background: true,
    dataType: "jsonp"
  })
};

m(infinite, {
  maxPages: 16,
  pageData: getPageData,
  item: handlePageItem
});
~~~

You can use `fetch` instead of `m.request`.



### Intercepting page count

Assume the server delivers the total page count with json (and received with the function passed in `pageData`):

~~~javascript
"pageCount": 9,
"results": ["one", "two", "three", ...]
~~~

`results` is the data for the requested page.

The page count information can be used to set the component"s `maxPages` parameter. We only need to grab the page count value before passing on the results.

For instance in the controller:

~~~javascript
const getData = page =>
  m.request({
    method: "GET",
    url: "http://mysite.com/data?pageSize=12&page=" + page,
    initialValue: [],
    background: true,
    dataType: "jsonp"
  });
};
const pageCount = m.prop();
const pageData = pageNum =>
  getData(pageNum).then(response => {
    pageCount(response.pageCount);
    setTimeout(m.redraw, 0); // because we are using "background: true" with m.request
    return [response.results];
  })
};

return {
  pageData,
  pageCount
};
~~~

And in the view:

~~~javascript
return m(".results", m(infinite, {
  maxPages: ctrl.pageCount(),
  item: item,
  pageData: ctrl.pageData
}));
~~~

### Pagination

See the "paging" example.


## Configuration options

### Appearance options

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **scrollView** | optional | Selector String | | Pass an element"s selector to assign another element as scrollView |
| **class** | optional | String |  | Extra CSS class appended to "mithril-infinite__scroll-view" |
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
| **pageUrl** | either `pageData` or `pageUrl` | Function (page: Number) => String | | Function that accepts a page number and returns a URL String |
| **pageData** | either `pageData` or `pageUrl` | Function (page: Number) => Promise | | Function that fetches data; accepts a page number and returns a promise |
| **item** | required | Function (data: Array, options: Object) => Mithril Template | | Function that creates an item from data |
| **pageSize** | optional | Function (content: Array) => Number | Pass a pixel value to set the size (height or width) of each page; the function accepts the page content and returns the size |
| **pageChange** | optional | Function (page: Number) | | Notifies the current page on change |
| **processPageData** | optional | Function (data: Array, options: Object) => Array | | Function that maps over the page data and returns an item for each |
| **getDimensions** | optional | Function () => {scrolled: Number, size: Number} | | Returns an object with state dimensions of `scrollView`: `scrolled` (either scrollTop or scrollLeft) and `size` (either height or width); this function is called on each view update | 

### Paging options

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **currentPage**  | optional | Number | | Sets the current page |
| **from** | optional | Number | | Not needed when only one page is shown (use `currentPage`); use page data from this number and higher |
| **to** | optional | Number | | Not needed when only one page is shown (use `currentPage`); Use page data to this number and lower |


## Using images

Images should be loaded only when they appear on the screen. To check if the image is in the viewport, you can use the function `infinite.isElementInViewport(el)`. For example:

~~~javascript
m(".image", {
  config: function(el, inited, context) {
    if (context.inited) {
      return;
    }
    if (infinite.isElementInViewport({el:el})) {
      // use data.src
      context.inited = true;
    }
  }
})
~~~

Options for `infinite.isElementInViewport`:

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **el** | required | HTML Element | | The element to check |
| **axis** | optional | String | "y" | The scroll axis, either "y" or "x" |
| **leeway** | optional | Number | 300 | The extended area; by default the image is already fetched when it is 100px outside of the viewport |

Note that for scrolling backwards, leeway must be passed with a negative value.


Images should not be shown with the `<img/>` tag: while this works fine on desktop browsers, this causes redrawing glitches on iOS Safari. The solution is to use `background-image`. For example:

~~~javascript
el.style.backgroundImage = "url(" + url + ")"
~~~


## Using table data

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

### Generated HTML

~~~html
<div class="mithril-infinite__scroll-view mithril-infinite__scroll-view--y">
    <div class="mithril-infinite__scroll-content">
        <div style="height: 0px;"></div> <!-- padding before -->
        <div class="mithril-infinite__content">
            <div data-page="000001" class="mithril-infinite__page mithril-infinite__page--odd" style="height: auto;">
                <!-- list items -->
            </div>
        </div>
        <div style="height: 0px;"></div> <!-- padding after -->
    </div>
</div>
~~~



## Styling

Note: The parent of "scroll-view" must have a height.

The including of styles is done with the help of [j2c](https://github.com/pygy/j2c). This library is also included in the examples.


## Data structure

Data is handled per "results" page. Each page is a JSON data object that contains a list of item data.

Examples:

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



## Future improvements

* Store current "page" in url so the location can be bookmarked.
* Smarter handling of "no data found" (works fine if maxPages is set, otherwise gives 404 in console).
* Optimize page load order, for example de-prioritize loading of the previous page.
* `after` content does not work well with "loadable space" (example "short content").



## Size

Minified and gzipped: ~ 5.5 Kb



## Dependencies

Included in mithril-infinite.js:

* [Verge](https://www.npmjs.com/package/verge) - for measuring the viewport
* [j2c](https://github.com/pygy/j2c) - for creating js stylesheets

External dependency

* [Mithril](https://www.npmjs.com/package/mithril)


## Licence

MIT
