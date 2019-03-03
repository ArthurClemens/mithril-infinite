/*
This example shows how to get the total page count from a request, and use that to calculate the total content height.
*/
import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("fixed", styles);

const PAGE_ITEMS =           12;
const ITEM_HEIGHT =          36 + 1; // include border
const PAGE_COUNT =           10;

const item = (data, opts) => (
  m(".list-item", [
    m("div", opts.pageNum),
    m("div", data.title)
  ]));

export default {
  view: () => {
    return m(infinite, {
      pageData: () => data,
      maxPages: PAGE_COUNT,
      preloadPages: 3,
      item,
      class: "table fixed",
      // set the size of each page
      pageSize: () => PAGE_ITEMS * ITEM_HEIGHT,
      // set the total height
      contentSize: PAGE_COUNT * PAGE_ITEMS * ITEM_HEIGHT,
      after: footer()
    });
  }
};

const data = [
  {
    "albumId": 1,
    "id": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "http://placehold.it/600/92c952",
    "thumbnailUrl": "http://placehold.it/150/92c952"
  },
  {
    "albumId": 1,
    "id": 2,
    "title": "reprehenderit est deserunt velit ipsam",
    "url": "http://placehold.it/600/771796",
    "thumbnailUrl": "http://placehold.it/150/771796"
  },
  {
    "albumId": 1,
    "id": 3,
    "title": "officia porro iure quia iusto qui ipsa ut modi",
    "url": "http://placehold.it/600/24f355",
    "thumbnailUrl": "http://placehold.it/150/24f355"
  },
  {
    "albumId": 1,
    "id": 4,
    "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
    "url": "http://placehold.it/600/d32776",
    "thumbnailUrl": "http://placehold.it/150/d32776"
  },
  {
    "albumId": 1,
    "id": 5,
    "title": "natus nisi omnis corporis facere molestiae rerum in",
    "url": "http://placehold.it/600/f66b97",
    "thumbnailUrl": "http://placehold.it/150/f66b97"
  },
  {
    "albumId": 1,
    "id": 6,
    "title": "accusamus ea aliquid et amet sequi nemo",
    "url": "http://placehold.it/600/56a8c2",
    "thumbnailUrl": "http://placehold.it/150/56a8c2"
  },
  {
    "albumId": 1,
    "id": 7,
    "title": "officia delectus consequatur vero aut veniam explicabo molestias",
    "url": "http://placehold.it/600/b0f7cc",
    "thumbnailUrl": "http://placehold.it/150/b0f7cc"
  },
  {
    "albumId": 1,
    "id": 8,
    "title": "aut porro officiis laborum odit ea laudantium corporis",
    "url": "http://placehold.it/600/54176f",
    "thumbnailUrl": "http://placehold.it/150/54176f"
  },
  {
    "albumId": 1,
    "id": 9,
    "title": "qui eius qui autem sed",
    "url": "http://placehold.it/600/51aa97",
    "thumbnailUrl": "http://placehold.it/150/51aa97"
  },
  {
    "albumId": 1,
    "id": 10,
    "title": "beatae et provident et ut vel",
    "url": "http://placehold.it/600/810b14",
    "thumbnailUrl": "http://placehold.it/150/810b14"
  },
  {
    "albumId": 1,
    "id": 11,
    "title": "nihil at amet non hic quia qui",
    "url": "http://placehold.it/600/1ee8a4",
    "thumbnailUrl": "http://placehold.it/150/1ee8a4"
  },
  {
    "albumId": 1,
    "id": 12,
    "title": "mollitia soluta ut rerum eos aliquam consequatur perspiciatis maiores",
    "url": "http://placehold.it/600/66b7d2",
    "thumbnailUrl": "http://placehold.it/150/66b7d2"
  }
];
