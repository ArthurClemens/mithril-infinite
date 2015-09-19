import vars from '../app/variables';

const side_padding = 16;

const styles = [
	{
		'.github': {
			'width': (vars.size - 2 * side_padding) + 'px',
			'margin': '32px auto 0 auto',
			'text-align': 'left',
			'padding': '24px ' + side_padding + 'px',
			'font-size': '14px',
			'color': '#90A4AE',
			'opacity': '.85',
			
			' hr': {
				'height': '1px',
				'border': 'none',
				'margin': '1em -' + side_padding + 'px',
				'background-color': '#CFD8DC',
				'opacity': '.85'
			}
		}
	}
];

export default styles;
