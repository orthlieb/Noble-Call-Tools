var log = require('helpers/logger');
var style = require('ui/style');
var ui = require('ui');

var tr = Ti.UI.create2DMatrix();
tr = tr.rotate(90);

var slide_in =  Titanium.UI.createAnimation({ bottom: 0 });
var slide_out =  Titanium.UI.createAnimation({ bottom: -style.picker.height });

// Main Class: sets up a text field as a combo box.
function ComboBox(/*TiUIWindow*/parent, /*TextField args*/args) {
	log.start();

	// We're going to subclass the textField.
	var drop_button =  ui.button({
		style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
		transform: tr
	});
	args.rightButton = drop_button;
	args.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
	var self = Ti.UI.createTextField(args);	// Create the textfield

	// The picker view holds the picker and toolbar.
	var pickerView = ui.view({
		height: style.picker.height,
		bottom: -style.picker.height,
		backgroundColor: style.color.backgroundColor
	});
	
	self.picker = Titanium.UI.createPicker({
		top: style.picker.top,
		height: style.picker.height
	});
	self.picker.selectionIndicator = true;

	var cancel =  ui.button({
		title: L('button_cancel'),
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundColor: style.color.buttonHighlight
	});

	var done = ui.button({
		title: L('button_done'),
		style: Ti.UI.iPhone.SystemButtonStyle.DONE,
		backgroundColor: style.color.buttonHighlight
	});

	var spacer = ui.button({
		systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar = Titanium.UI.createToolbar({
		top: 0,
		items: [cancel, spacer, done],
		barColor: style.color.navBar
	});
	
	pickerView.add(toolbar);
	pickerView.add(self.picker);
	
	// Add the behavior to open/close the picker and populate the text field.
	self.addEventListener('focus', function() {
		pickerView.animate(slide_out);
		self.parent.remove(pickerView);
	});	
	
	drop_button.addEventListener('click',function() {
		self.parent.add(pickerView);
		pickerView.animate(slide_in);
		self.blur();
	});

	cancel.addEventListener('click',function() {
		pickerView.animate(slide_out);
		self.parent.remove(pickerView);
	});

	done.addEventListener('click',function() {
		self.value =  self.picker.getSelectedRow(0).title;
		self.fireEvent('change', { source: self, type: 'change', value: self.value });
		pickerView.animate(slide_out);
		self.parent.remove(pickerView);
	});
	
	return self;
}

// External interface
module.exports = ComboBox;