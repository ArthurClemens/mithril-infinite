'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _infinite = require('infinite');

var _infinite2 = _interopRequireDefault(_infinite);

require('./grid.css!');

var IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

var vm = {
    seen: {}
};

// fade in first time only
var fadeInImage = function fadeInImage(el, imgUrl) {
    var url = IMG_URL + imgUrl;
    var showImage = function showImage() {
        el.style.backgroundImage = 'url(' + url + ')';
        el.style.opacity = 1;
        vm.seen[url] = 1;
    };

    function _ref() {
        showImage();
    }

    if (!vm.seen[url]) {
        var img = new Image();
        img.onload = _ref;
        img.src = url;
    } else {
        showImage();
    }
};

var item = function item(data) {
    return (0, _mithril2['default'])('a.grid-item', (0, _mithril2['default'])('.image-holder', (0, _mithril2['default'])('.image', {
        config: function config(el, inited, context) {
            if (context.inited) {
                return;
            }
            if (_infinite2['default'].isElementInViewport({ el: el })) {
                fadeInImage(el, data.src);
                context.inited = true;
            }
        }
    })));
};

var component = {};

function _ref2(page) {
    return 'app/grid/data/page-' + page + '.json';
}

function _ref3(page) {
    if (console) {
        console.log('page', page);
    }
}

component.view = function () {
    return _mithril2['default'].component(_infinite2['default'], {
        maxPages: 16, // pages of 12 items each
        item: item,
        pageUrl: _ref2,
        'class': 'grid',
        pageChange: _ref3
    });
};

exports['default'] = component;
module.exports = exports['default'];
