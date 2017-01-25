[Main README](https://github.com/ArthurClemens/mithril-infinite)


# Infinite Scroll for Mithril - Examples



## Online examples

* [Infinite Scroll Examples](http://arthurclemens.github.io/mithril-infinite/index.html)
* [Example with header panel (Polythene)](http://arthurclemens.github.io/Polythene-examples/index.html#/header-panel/infinite)



## About the examples

### Images

Demonstrates an endless list of images with irregular heights that can each be further expanded.

On a regular laptop/desktop screen, not more than 3 page elements (out of 20) exist at a time.

This demo shows the parameters `before` and `after`.


### Grid

A grid of `inline-block` items. A naive approach would be to use the principle of the image list. But scrolled up pages are removed including all of its elements. This would easily lead to gaps in the row, causing all kinds of jumping around of the remaining images.

The trick here is to load page data with 12 images at a time, and laying out the grid as 2, 3, 4 or 6 columns. This way pages are always displayed (and removed) as complete rows.


### Table

Demonstrating a list of simple table like data. To prevent redrawing issues, instead of `<table>` tags, we use divs with table styling.


### Short content

Traditional approaches use a div at the bottom of the content; when it is scrolled into the viewport, new data is fetched. This example demonstrates that this can be done faster. Infinite calculates the remaining space and increases the `preloadPages` count.


### Horizontal

This is a bit more tricky because the horizontal width needs to be set ("auto" or "100%"" doesn"t work).
In the demo we use `pageSize` that returns the item width * item count, making sure we have a default width in case the count is 0 (which happens when no data has been received yet).

With CSS, the blocks "mithril-infinite__content", "mithril-infinite__padding-before" and "mithril-infinite__padding-after" need to be set to `inline-block`.


### Fixed

Sometimes it is useful to present the user predictable scrollbar behavior: scrolling the scroll knob all the way down leads to the last content page. This is only possible when you know the size of the content (calculated by the number of pages times the height of each page). This example demonstrates the use of the param `contentSize` together with `pageSize`.


### Paging

Demonstrates how to set up pagination with Next / Previous buttons.



## Running the examples locally

From the project root:

* `npm install`
* `lerna bootstrap`
* `cd packages/examples`
* `npm run watch`
* Open browser at http://localhost:8080/


