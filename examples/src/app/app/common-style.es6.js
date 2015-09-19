import vars from './variables';

const styles = [
	{
		' html, body': {
			'min-height': '100%',
			'height': '100%'
		},
		' body': {
			'margin': 0,
			'padding': 0,
			'font-family': 'arial, sans-serif',
			'min-width': vars.size_px
		},
		' h1': {
			'display': 'block',
			'margin': '40px auto 0 auto',
			'width': '320px',
			'text-align': 'center',
			'font-size': '28px',
			'font-weight': 'normal',
			'color': vars.text_color
		},
		' a': {
			'&:link, &:visited': {
				'color': '#1E88E5',
				'text-decoration': 'none'
			}
		}
	}
];
export default styles;
		