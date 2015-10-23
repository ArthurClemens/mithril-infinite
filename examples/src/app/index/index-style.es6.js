import vars from '../app/variables';

const text_color_light = '#90A4AE';
const index_block_background_color = '#CFD8DC';
const index_block_text_color = 'rgba(0,0,0,.85)';
const index_block_text_color_light = 'rgba(0,0,0,.4)';
const menu_width = vars.size_px;

const styles = [{
    '.menu': {
        width: menu_width,
        margin: '20px auto',
        padding: '0 0 20px 0',
        'list-style': 'none',

        ' li': {
            margin: '0 0 1px 0',
            padding: 0,

            '&.header': {
                'font-size': '18px',
                color: text_color_light
            },
            '&.header, a': {
                padding: '20px'
            },
            ' a': {
                display: 'block',
                'text-decoration': 'none',
                'background-color': index_block_background_color,

                ' .title': {
                    display: 'block',
                    color: index_block_text_color,
                    'font-size': '18px',
                    'line-height': 1.4 * 18 + 'px'
                },
                ' .subtitle': {
                    display: 'block',
                    color: index_block_text_color_light,
                    'font-size': '14px'
                }
            }
        }
    }
}];

export default styles;
