var log = require('helpers/logger');
var style = require('ui/style');
var ui = require('ui/ui');

var tr = Ti.UI.create2DMatrix();
tr = tr.rotate(90);

// Main Class: sets up a text field as a combo box.
function ComboBox(/*TiUIWindow*/parent, /*TextField args*/args) {
	log.start();

	// We're going to subclass the textField.
	var dropButton =  ui.button({
		style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
		transform: tr
	});
	args.rightButton = dropButton;
	args.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
	var self = Ti.UI.createTextField(args);	// Create the textfield

	// The picker view holds the picker and toolbar.
	var pickerView = ui.view({
	    left: 0,
		bottom: parent.size.height,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		backgroundColor: style.win.backgroundColor,
		layout: 'vertical'
	});
	parent.add(pickerView);                       // Add it to the window so that it gets sized properly.
    pickerView.bottom = -pickerView.size.height;  // Now that it is rendered position it just below the view ready for sliding up.
    parent.remove(pickerView);                    // Add it at window properly at drop down time.
	
    var toolbar = Titanium.UI.createView({
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: 35 + 2 * ui.dim.gutter, // Ti.UI.SIZE, // TIBUG: Can't dynamically figure this out.
        barColor: style.win.barColor
    });
    pickerView.add(toolbar);	
    
    var cancel =  ui.button({
        top: ui.dim.gutter,
        left: ui.dim.gutter,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
		title: L('button_cancel')
	});
	toolbar.add(cancel);

	var done = ui.button({
        top: ui.dim.gutter,
        right: ui.dim.gutter,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
		title: L('button_done')
	});
    toolbar.add(done);

    // The picker control
    self.picker = Titanium.UI.createPicker({
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) * 0.6
    });
    self.picker.selectionIndicator = true;
    pickerView.add(self.picker);

    // // Re-layout the toolbar once the Done button is sized. // TIBUG: Can't dynamically figure this out.
    // done.addEventListener('postlayout', function pickerViewPostLayout(e) {
        // toolbar.height = done.size.height + ui.dim.gutter * 2;
        // log.info('Toolbar height is now: ' + toolbar.height); 
        // done.removeEventListener('postlayout', pickerViewPostLayout);    
    // });

	// Add the behavior to open/close the picker and populate the text field.
	self.addEventListener('focus', function() {
        pickerView.animate({ bottom: -pickerView.size.height });
		parent.remove(pickerView);
	});	
	
	dropButton.addEventListener('click',function() {
	    pickerView.bottom = -pickerView.size.height;
	    parent.add(pickerView);
		pickerView.animate({ bottom: 0 });
		self.blur();
	});

	cancel.addEventListener('click',function() {
		pickerView.animate({ bottom: -pickerView.size.height });
		parent.remove(pickerView);
	});

	done.addEventListener('click',function() {
		self.value =  self.picker.getSelectedRow(0).title;
		self.fireEvent('change', { source: self, type: 'change', value: self.value });
		pickerView.animate({ bottom: -pickerView.size.height });
		parent.remove(pickerView);
	});
	
	return self;
}

// External interface
module.exports = ComboBox;