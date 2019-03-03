[Infinite Scroll documentation](https://github.com/ArthurClemens/mithril-infinite/tree/master/packages/mithril-infinite)



# Infinite Scroll examples



## Online examples

[View Infinite Scroll examples](http://arthurclemens.github.io/mithril-infinite/)




## Viewing locally

* `git clone https://github.com/ArthurClemens/mithril-infinite.git`
* `cd mithril-infinite`
* Install Lerna globally: `npm install -g lerna`
* `npm install`
* `lerna bootstrap`
* `cd packages/examples`
* `npm run dev`
* Open browser at [localhost:3000](http://localhost:3000/)



## About the examples

### Images

Demonstrates support for unequal content heights and dynamic resizing of content elements, including options `before` and `after`.



### Horizontal

This is a bit more tricky because the horizontal width needs to be set ("auto" or "100%" doesn't work).
In the demo we use `pageSize` that returns the `item width * item count`, making sure we have a default width in case the count is 0 (which happens when no data has been received yet).

With CSS, the blocks `mithril-infinite__content`, `mithril-infinite__padding-before` and `mithril-infinite__padding-after` need to be set to `inline-block`.



### Grid

A grid of `inline-block` items. A naive approach would be to use the principle of the image list, but scrolled up pages are removed including all of its elements. This would easily lead to gaps in the row, causing all kinds of jumping around of the remaining images.

The trick here is to get neat blocks as "pages" by loading page data with 12 images at a time, and laying them out on a grid of 2, 3, 4 or 6 columns. This way pages are always displayed (and removed) as complete rows.



### Filtering

A search field to filter a list of names.
Demonstrates option `pageKey` to notify Mithril that pages need to be recreated.



### Table

Demonstrates a list of simple table-like data. To prevent redrawing issues, instead of `<table>` tags, we use divs with table styling.



### Short content

Traditional approaches use a div at the bottom of the content; when it is scrolled into the viewport, new data is fetched. This example demonstrates that an alternative approach is much faster. Infinite calculates the remaining space and increases the `preloadPages` count.



### Fixed

Sometimes it is useful to present the user predictable scrollbar behavior: scrolling the scroll knob all the way down leads to the last content page. This is only possible when you know the size of the content (calculated by the number of pages times the height of each page). This example shows how to get the total page count from a request, and use that to calculate the total content height.




### Paging

Demonstrates how to set up pagination with Previous / Next buttons.




