'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _infinite = require('infinite');

var _infinite2 = _interopRequireDefault(_infinite);

require('./images.css!');

var IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';

var vm = {
    expanded: {},
    dirty: {},
    toggle: function toggle(id) {
        if (vm.expanded[id]) {
            delete vm.expanded[id];
        } else {
            vm.expanded[id] = 1;
        }
        vm.dirty[id] = 1;
    },
    isExpanded: function isExpanded(id) {
        return vm.expanded[id];
    },
    isDirty: function isDirty(id) {
        return vm.dirty[id];
    },
    clearDirty: function clearDirty(id) {
        return delete vm.dirty[id];
    }
};

var item = function item(data, opts) {
    var id = opts.page + data.src;
    var isExpanded = vm.isExpanded(id);
    var isDirty = vm.isDirty(id);
    var heightFraction = isExpanded ? 0.5 : 0.25;

    return (0, _mithril2['default'])('a.list-item', {
        style: {
            height: Math.floor(parseInt(data.height, 10) * heightFraction) + 'px'
        },
        onclick: function onclick() {
            vm.toggle(id);
        }
    }, [(0, _mithril2['default'])('span.pageNum', opts.page), (0, _mithril2['default'])('.image', {
        style: {
            height: Math.floor(parseInt(data.height, 10) * heightFraction) + 'px',
            width: Math.floor(parseInt(data.width, 10) * heightFraction) + 'px'
        },
        config: function config(el, inited, context) {
            if (context.inited && !isDirty) {
                return;
            }
            if (_infinite2['default'].isElementInViewport({ el: el })) {
                var url = IMG_URL + data.src;
                el.style.backgroundImage = el.style.backgroundImage = 'url(' + url + ')';
                context.inited = true;
                vm.clearDirty(id);
            }
        }
    }),
    // minus or plus sign
    (0, _mithril2['default'])('.toggle', isExpanded ? _mithril2['default'].trust('&#150;') : _mithril2['default'].trust('&#43;'))]);
};

var component = {};

function _ref(page) {
    return 'app/images/data/page-' + page + '.json';
}

function _ref2() {
    vm.toggle('before');
}

function _ref3(page) {
    if (console) {
        console.log('page', page);
    }
}

component.view = function () {
    return _mithril2['default'].component(_infinite2['default'], {
        maxPages: 20,
        item: item,
        pageUrl: _ref,
        preloadPages: 3,
        'class': 'images',
        before: (0, _mithril2['default'])('a', {
            'class': ['list-item', vm.isExpanded('before') ? 'open' : 'closed'].join(' '),
            onclick: _ref2 }, [(0, _mithril2['default'])('div', _mithril2['default'].trust('A list of pugs. I didn\'t know they were called like that. Courtesy the <a href="http://airbnb.io/infinity/demo-off.html">AirBnb Infinity demo</a>.')), (0, _mithril2['default'])('.toggle', vm.isExpanded('before') ? _mithril2['default'].trust('&#150;') : _mithril2['default'].trust('&#43;'))]),
        after: (0, _mithril2['default'])('div.list-item', _mithril2['default'].trust('That was the last pug.')),
        pageChange: _ref3
    });
};

exports['default'] = component;
module.exports = exports['default'];
