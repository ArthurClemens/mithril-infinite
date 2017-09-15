import m from "mithril";
import footer from "../app/footer";
import infinite from "mithril-infinite";
import 'whatwg-fetch';

import { addStyle } from "../app/styler";
import styles from "./styles";
addStyle("grid", styles);

const PAGE_ITEMS = 12;
const IMAGE_SIZE = 190;

const loadImage = (el, imgUrl) => {
  const url = imgUrl.replace(/\/150\//, `/${IMAGE_SIZE}/`);
  const populate = () => {
    el.style.backgroundImage = `url(${url})`;
  };
  let img = new Image();
  img.onload = populate;
  img.src = imgUrl;
};

const maybeLoadImage = (vnode, data) => {
  if (vnode.state.inited) {
    return;
  }
  if (infinite.isElementInViewport({ el: vnode.dom })) {
    loadImage(vnode.dom, data.thumbnailUrl);
    vnode.state.inited = true;
  }
};

const item = data =>
  m("a.grid-item",
    m(".image-holder",
      m(".image", {
        oncreate: vnode => maybeLoadImage(vnode, data),
        onupdate: vnode => maybeLoadImage(vnode, data)
      })
    )
  );

const dataUrl = pageNum =>
  `http://jsonplaceholder.typicode.com/photos?_start=${(pageNum - 1) * PAGE_ITEMS}&_end=${pageNum * PAGE_ITEMS}`;

const pageData = pageNum => 
  m.request({
    method: "GET",
    dataType: "jsonp",
    url: dataUrl(pageNum)
  });

const asyncPageData = async function(pageNum) {
  return await fetchPageData(pageNum);
};

const fetchPageData = pageNum => 
  fetch(dataUrl(pageNum))
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      return json;
    }).catch(function() {
      //console.log('parsing failed', ex)
    });

const returnData = () =>
  data;

const returnDelayedData = () =>
  new Promise(resolve =>
    setTimeout(() =>
      resolve(data)
    , 1000)
  );

export default {
  view: () => 
    m(infinite, {
      preloadPages: 3,
      item,
      // Different approaches for getting data:

      // 1. Use m.request:
      pageData,

      // 2. Use async/await with fetch:
      // pageData: asyncPageData,

      // 3. Return data directly
      // pageData: returnData,

      // 4. Return data as a Promise
      // pageData: returnDelayedData,
      
      class: "grid",
      after: footer()
    })
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