// assign transpile variables that we are including here in the html
window._mithril2.default = m;
window._verge2.default = verge;

var IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

var vm = {
    seen: {}
};

// fade in first time only
var fadeInImage = function(el, imgUrl) {
    var url = IMG_URL + imgUrl;
    var showImage = function() {
        el.style.backgroundImage = 'url(' + url + ')';
        el.style.opacity = 1;
        vm.seen[url] = 1;
    };
    if (!vm.seen[url]) {
        var img = new Image();
        img.onload = function() {
            showImage();
        };
        img.src = url;
    } else {
        showImage();
    }
};

var item = function(data) {
    return m('a.grid-item',
        m('.image-holder',
            m('.image', {
                config: function(el, inited, context) {
                    if (context.inited) {
                        return;
                    }
                    if (infinite.isElementInViewport({
                            el: el
                        })) {
                        fadeInImage(el, data.src);
                        context.inited = true;
                    }
                }
            })
        )
    );
};

var component = {};
component.view = function() {
    return m.component(infinite, {
        maxPages: 16, // pages of 12 items each
        item: item,
        pageUrl: function(page) {
            return 'data/page-' + page + '.json';
        },
        class: 'grid'
    });
};

m.mount(document.body, component);
