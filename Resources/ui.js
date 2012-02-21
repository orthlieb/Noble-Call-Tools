//some keystroke-savers :)
function view(args) {
	return Ti.UI.createView(args);
}

function label(args) {
	return Ti.UI.createLabel(args);
}

function image(args) {
	return Ti.UI.createImageView(args);
}

function window(args) {
	return Ti.UI.createWindow(args);
}

function button(args, onclick) {
	var btn = Ti.UI.createButton(args);
	if (onclick != null)
		btn.addEventListener('click', onclick);
	return btn;
}

function scrollview(args) {
	var sv = Ti.UI.createScrollView(args);
	return sv;
}

function textfield(args) {
	var tf = Ti.UI.createTextField(args);
	return tf;
}

//Public Module API
exports.textfield = textfield;
exports.view = view;
exports.label = label;
exports.image = image;
exports.button = button;
exports.scrollview = scrollview;
exports.window = window;