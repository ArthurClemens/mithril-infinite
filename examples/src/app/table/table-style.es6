const styles = [{
    '.mithril-infinite__scroll-view.table': {
        'min-width': '320px',
        margin: '0 auto',
        background: '#eee',

        ' .mithril-infinite__scroll-content': {
            ' .mithril-infinite__page': {
                display: 'table',
                width: '100%'
            },
            ' .mithril-infinite__page--odd': {
                'background-color': '#eceff1',

                ' .list-item': {
                    ' > div': {
                        color: 'rgba(0,0,0,.87)',
                        'border-bottom': '1px solid rgba(0, 0, 0, .07)',

                        ':first-child': {
                            color: 'rgba(0,0,0,.54)'
                        }
                    }
                }
            },
            ' .mithril-infinite__page--even': {
                'background-color': '#263238',

                ' .list-item': {
                    ' > div': {
                        color: '#fff',
                        'border-bottom': '1px solid rgba(255,255,255,.11)',

                        ':first-child': {
                            color: 'rgba(255,255,255,.7)'
                        }
                    }
                }
            },
            ' .list-item': {
                width: '100%',
                display: 'table-row',

                ' > div': {
                    display: 'table-cell',
                    'vertical-align': 'top',
                    padding: '8px 16px',
                    'min-height': '1em',
                    width: '90%',

                    ':first-child': {
                        color: '#aaa',
                        width: '10%',
                        'text-align': 'right'
                    }
                }
            }
        }
    }
}];
export default styles;
