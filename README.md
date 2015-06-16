# Infinite scroll for Mithril

Version 0.1.3


## Examples

[Infinite Scroll Examples](http://arthurclemens.github.io/mithril-infinite/index.html)


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

* Download or clone from Github, or `npm install mithril-infinite`
* In `mithril-infinite` directory: `npm install`


## Usage

	import infinite from 'infinite';

	m.component(infinite, {
        maxPages: 16,
        pageUrl: function(page) {return 'app/data/page-' + page + '.json';},
        item: handlePageItem
    });

Here we limit the number of pages to 16, pass a function to generate a JSON data URL, and pass a function that creates an item (Mithril template/component):

    const handlePageItem = function(data, opts) {
    	return m('.item', [
    	    m('h2', data.title),
    	    m('div', opts.page)
    	]);
    };



### Configuration parameters

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **pageUrl** | required | Function :: Number => String | | Function that accepts a page number and returns a URL String |
| **item** | required | Function :: (Array, Object) => Mithril Template | | Function that creates an item from data | 
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

Options for `infinite.isElementInViewport`:

| **Parameter** |  **Mandatory** | **Type** | **Default** | **Description** |
| ------------- | -------------- | -------- | ----------- | --------------- |
| **el** | required | HTML Element | | The element to check |
| **axis** | optional | String | 'y' | The scroll axis, either 'y' or 'x' |
| **leeway** | optional | Number | 100 | The extended area; by default the image is already fetched when it is 100px outside of the viewport |


Images should not be shown with the `<img/>` tag: while this works fine on desktop browsers, this causes redrawing glitches on iOS Safari. The solution is to use `background-image`. For example:

    el.style.backgroundImage = 'url(' + url + ')'


### Using table data

Using `<table>` tags causes reflow problems. Use divs instead, with CSS styling for table features. For example:

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



### Generated HTML

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



### Styling 

The parent of 'scroll-view' must have a height.



### Data structure

Data is handled per "results" page. Each page is a JSON data object that contains a list of item data.

Examples:

    [
        {
            "src": "cat.jpg",
            "width": 500,
            "height": 375
        },
        ...
    ]

Or:

    [
        ["red", "#ff0000"],
        ...
    ]




## Running the examples locally

Examples are written in es6 and sass and are compiled to es5 and css:

* `npm install && npm run compile-examples`

View the example site for example with `http-server`:

* `http-server examples/src`



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
* Optimize page load order
* Support other types of data input



## Size

Minified and gzipped: 1.9 Kb



## Dependencies

* [Mithril](https://www.npmjs.com/package/mithril)
* [Verge](https://www.npmjs.com/package/verge)



## Licence

MIT

