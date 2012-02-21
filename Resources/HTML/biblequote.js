window.onload = function() {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].setAttribute('onClick', "Ti.App.fireEvent('requestBibleQuote', { verse: '" + buttons[i].innerHTML + "'})");
	}
};
