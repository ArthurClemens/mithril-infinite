import j2c from 'j2c';

const removeStyle = (id) => {
	if (id) {
		const old = document.getElementById(id);
		if (old) {
			old.parentNode.removeChild(old);
		}
	}
};

/*
styles: list of lists
*/
const addStyle = (id, ...styles) => {
	removeStyle(id);
	const styleEl = document.createElement('style');
	if (id) {
		styleEl.setAttribute('id', id);
	}
	styles.forEach((styleList) => {
		// each style returns a list
		styleList.forEach((style) => {
			const sheet = j2c.sheet(style);
			styleEl.appendChild(document.createTextNode(sheet));
		});
	});
	document.head.appendChild(styleEl);
};

const styler = {
	add: addStyle,
	remove: removeStyle
};

export default styler;
