'use strict';

import m from 'mithril';
import github from 'app/app/github';
import infinite from 'mithril-infinite';

import styler from 'app/app/styler';
import pagingStyle from 'app/paging/paging-style';
styler.add('paging', pagingStyle);


const IMG_URL = 'http://arthurclemens.github.io/assets/mithril-infinite-scroll/thumbs/';


const item = (data) => {
    return m('a.grid-item',
        m('.image-holder',
            m('.image', {
                config: (el, inited, context) => {
                    if (context.inited) {
                        return;
                    }
                    el.style.backgroundImage = 'url(' + IMG_URL + data.src + ')';
                }
            })
        )
    );
};

const component = {};
component.controller = () => {
    const getData = (page) => {
        return m.request({
            method: 'GET',
            url: 'app/grid/data/page-' + page + '.json'
        });
    };
    const pageCount = m.prop();
    const page = m.route.param('page')
        ? parseInt(m.route.param('page'), 10)
        : 1;
    const pageNum = m.prop(page);
    const pageData = (pageNum) => {
        return getData(pageNum).then((response) => {
            pageCount(response.length);
            return response;
        });
    };

    return {
        pageData,
        pageCount,
        pageNum,
        hasPrev: () => (pageNum() > 1),
        hasNext: () => (pageNum() !== pageCount())
    };
};
component.view = (ctrl) => {
    const pageNum = m.route.param('page')
        ? parseInt(m.route.param('page'), 10)
        : ctrl.pageNum();

    return m('div', [
        m('.paging', [
            m('.count', `Page ${pageNum}`),
            m.component(infinite, {
                item: item, // draws one item
                pageData: ctrl.pageData, // fetches data
                pageChange: ctrl.pageNum,
                currentPage: pageNum,
                autoSize: false // disabled because we are already setting the height in CSS
            }),
            m('.pager', [
                m('a', {
                    class: !ctrl.hasPrev() ? 'disabled' : '',
                    href: '/paging?page=' + (pageNum - 1),
                    config: m.route
                }, 'Prev'),
                m('a', {
                    class: !ctrl.hasNext() ? 'disabled' : '',
                    href: '/paging?page=' + (pageNum + 1),
                    config: m.route
                }, 'Next')
            ])
        ]),
        github()
    ]);
};

export default component;
