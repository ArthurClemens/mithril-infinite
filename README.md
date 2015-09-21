# Infinite Scroll for Mithril on mobile and desktop

Version 0.2.1


## Examples

* [Infinite Scroll Examples](http://arthurclemens.github.io/mithril-infinite/index.html)
* [Example with header panel (Polythene)](http://arthurclemens.github.io/Polythene-Examples/infinite.html)


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

Not included:

* Special support for older mobile browsers: no touch layer, requestAnimationFrame, absolute positioning or speed/deceleration calculations. There is a number of scroll libraries that help with that: [ScrollJs](http://scrolljs.com), [ftcroller](https://github.com/ftlabs/ftscroller). 


## Installation

Either:

* Download or clone from Github
* In the root directory: `npm install`

Or:

~~~bash
npm install mithril-infinite
~~~


## Examples

View the examples using a webserver, for instance:

~~~bash
http-server ./examples/src/
~~~


## Developing

For compiling/transpiling, you need to install the following:

~~~bash
npm install babel -g
~~~

Compile (transpile) everything:

~~~bash
npm run transpile
~~~

compiles all es6 files

While developing:

~~~bash
npm run watch
~~~

Watches changes to es6 files



## Usage

~~~javascript
import infinite from 'mithril-infinite';

m.component(infinite, {
    maxPages: 16,
    pageUrl: function(page) {return 'app/data/page-' + page + '.json';},
    item: handlePageItem
});
~~~

We have limited the number of pages to 16, pass a function to generate a JSON data URL, and pass a function that creates an item (Mithril template/component):

~~~javascript
const handlePageItem = function(data, opts) {
	return m('.item', [
	    m('h2', data.title),
	    m('div', opts.page)
	]);
};
~~~

### Custom requests

By default, the resulting URL from `pageUrl` is passed to a `m.request` function. This works for simple cases where data is fetched from the same server. If you need to access another server, this will likely fail. Instead create your own request and pass this with parameter `pageData`:

~~~javascript
const getPageData = (page) => {
    return m.request({
        method: 'GET',
        url: 'http://mysite.com/data?pageSize=12&page=' + page,
        initialValue: [],
        background: true,
        dataType: 'jsonp'
    });
};

m.component(infinite, {
    maxPages: 16,
    pageData: getPageData,
    item: handlePageItem
});
~~~

### Configuration parameters

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **pageUrl** | either `pageData` or `pageUrl` | Function :: Number => String | | Function that accepts a page number and returns a URL String |
| **pageData** | either `pageData` or `pageUrl` | Function :: Number => Promise | | Function that fetches data; accepts a page number and returns a promise |
| **item** | required | Function :: (Array, Object) => Mithril Template | | Function that creates an item from data | 
| **scrollView** | optional | Selector String | | Pass an element's selector to assign another element as scrollView |
| **class** | optional | String |  | Extra CSS class appended to 'scroll-view' |
| **contentTag** | optional | String | 'div' | HTML tag for the content element | 
| **pageTag** | optional | String | 'div' | HTML tag for the page element; note that pages have class `page` plus either `odd` or `even` |
| **maxPages** | optional | Number | `Number.MAX_VALUE` | Maximum number of pages to draw |
| **processPageData** | optional | Function :: (Array, Object options) => Array | | Function that maps over the page data and returns an item for each |
| **preloadPages** | optional | Number | 1 | Number of pages to preload when the app starts; if room is available, this number will increase automatically |
| **pageChange** | optional | Function :: (Number) | | Notifies the current page on change |
| **axis** | optional | String | 'y' | The scroll axis, either 'y' or 'x' |
| **before** | optional | Mithril template or component | | Content shown before the pages; has class `before` |
| **after** | optional | Mithril template or component | | Content shown after the pages; has class `after` |
| **pageSize** | optional | Function: Array => Number | Mainly to be used with horizontal scrolling; the function accepts the page content and returns the width | 




### Using images

Images should be loaded only when they appear on the screen. To check if the image is in the viewport, you can use the function `infinite.isElementInViewport(el)`. For example:

~~~javascript
m('.image', {
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
| **axis** | optional | String | 'y' | The scroll axis, either 'y' or 'x' |
| **leeway** | optional | Number | 100 | The extended area; by default the image is already fetched when it is 100px outside of the viewport |


Images should not be shown with the `<img/>` tag: while this works fine on desktop browsers, this causes redrawing glitches on iOS Safari. The solution is to use `background-image`. For example:

~~~javascript
el.style.backgroundImage = 'url(' + url + ')'
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

### Generated HTML

~~~html
<div class="scroll-view scroll-view-y">
    <div class="scroll-content">
        <div style="height: 0px;"></div> <!-- padding before -->
        <div class="content">
            <div data-page="000001" class="page odd" style="height: auto;">
                <!-- list items -->
            </div>
        </div>
        <div style="height: 0px;"></div> <!-- padding after -->
    </div>
</div>
~~~



### Styling

Side note: The parent of 'scroll-view' must have a height.

Mithril Infinite comes with a JavaScript based styling that uses [j2c](https://github.com/pygy/j2c), but there is no hard dependency - you can provide your own styles in any other way, for instance with the CSS file `mithril-infinite.css` (generated by npm script `standalone-css`).


#### j2c styling

The j2c way goes like this. In your application file:

~~~javascript    
import style from 'mithril-infinite-style';
~~~

The examples app dir contains a convenience function to add the styles to the document head:

~~~javascript
import styler from 'app/app/styler';
styler.add('mithril-infinite', style);
~~~
    

### Data structure

Data is handled per "results" page. Each page is a JSON data object that contains a list of item data.

Examples:

~~~json
[
    {
        "src": "cat.jpg",
        "width": 500,
        "height": 375
    },
]
~~~

Or:

~~~json
[
    ["red", "#ff0000"],
]
~~~



## Running the examples locally

Transpiled files are included, so the examples can be viewed without running transpilers.

View the example site for example with `http-server`:

~~~bash
http-server examples/src
~~~

In case you want to make changes, examples are written in es6 and are compiled to es5:

~~~bash
npm run transpile-examples
~~~



## About the examples 

### Images

A long list of images; each can be expanded. On a regular laptop/desktop screen, not more than 3 page elements (out of 20) exist at a time.

This demo shows the parameters `before` and `after`.


### Grid

A grid of `inline-block` items. A naive approach would be to use the principle of the image list. But scrolled up pages are removed including all of its elements. This would easily lead to gaps in the row, causing all kinds of jumping around of the remaining images.

The trick here is to load page data with 12 images at a time, and laying out the grid as 2, 3, 4 or 6 columns. This way pages are always displayed (and removed) as complete rows.


### Table

Demonstrating a list of simple table like data. To prevent redrawing issues, instead of `<table>` tags, we use divs with table styling.


### Short content

Traditional approaches use a div at the bottom of the content; when it is scrolled into the viewport, new data is fetched. This example demonstrates that this can be done faster. Infinite calculates the remaining space and increases the `preloadPages` count.


### Horizontal

This is a bit more tricky because the horizonal width needs to be set ('auto' or '100%'' doesn't work).
In the demo we use `pageSize` that returns the item width * item count, making sure we have a default width in case the count is 0 (which happens when no data has been received yet).

With CSS, the blocks 'content', 'paddingBefore' and 'paddingAfter' need to be set to `inline-block`.



## Future improvements

* Store current "page" in url so the location can be bookmarked.
* Smarter handling of "no data found" (works fine if maxPages is set, otherwise gives 404 in console).
* Optimize page load order, for example de-prioritize loading of the previous page.
* `after` content does not work well with "loadable space" (example "short content").



## Size

Minified and gzipped: 2473 bytes (core) plus 284 bytes (style): ~ 2.8 Kb


## Dependencies

* [Mithril](https://www.npmjs.com/package/mithril)
* [Verge](https://www.npmjs.com/package/verge) - for measuring the viewport

Optional dependency:

* [j2c](https://github.com/pygy/j2c) - for creating js stylesheets


## Licence

MIT

