var log = require('helpers/logger');
var style = require('ui/style');
var ui = require('ui');
var utils = require('helpers/utils');

// Gets all the applicable sizes based on the current size of the screen, used for initial layout and handling rotation
function getLayout(/*TiUIWindow*/parentWindow, /*boolean*/creation) {	
	var width = parentWindow.width - style.dim.gutter * 2;
	var height = parentWindow.height - style.dim.gutter - style.dim.navBarHeight;
  	// TIBUG: When creating a window, the status bar is there but the navBar isn't on rotation it is there.
	var top = style.dim.gutter + (creation ? 0 : style.dim.navBarHeight);
	var left = style.dim.gutter;
	
	var layout = {};
	
	layout.okButton = {
		top: height - style.dim.textFieldHeight + (creation ? 0 : style.dim.navBarHeight),
		left: (parentWindow.width - (width / 3)) / 2,
		width: width / 3,
		height:  style.dim.textFieldHeight
	};
	
	height -= (layout.okButton.height + style.dim.gutter * 2);
	
	layout.translucentView = {
		top: top,
		left: left,
		width: width,
		height: height
	};
	
	layout.scrollView = {
		left: left,
		top: top,
		width: width,
		height: height,
		contentWidth: width,
		contentHeight: 'auto',	
	}

	layout.textArea = {
		top: 0,
		left: 0,
		width: width
	}
	
	return layout;
}

// Standard relayout call.
function relayout() {
	var self = this;
	var layout = getLayout(self.win, false);
	
	for (var i in layout) {
		for (var j in layout[i]) {
			self[i][j] = layout[i][j];
		}
	}
}

// Main Class: creates a window to use as an Overlay dialog.
function OverlayDialog(/*Window args*/args) {
	log.start();
	var self = this;
	
	args.top = 0;
	args.left = 0;
	args.width = Ti.Platform.displayCaps.width;
	args.height = Ti.Platform.displayCaps.height;
	args.modal = true;
	
	self.win = ui.window(args);
	
	return self;
}

function open(/* Text */message) {
	log.start();
	
	var self = this;
	var layout = getLayout(self.win, true);
	
	self.okButton =  ui.button(utils.merge(layout.okButton, {
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		title: L('button_ok')
	}));
	self.win.add(self.okButton);
	self.okButton.addEventListener('click',function() {
		self.win.close();
	});	

	self.translucentView = ui.view(utils.merge(layout.translucentView, {
		backgroundColor: style.color.backgroundColor,
		opacity: style.opacity.translucentView,
		borderRadius: 5,
		borderWidth: 1,
	}));
	self.win.add(self.translucentView);
	
	self.scrollView = Ti.UI.createScrollView(utils.merge(layout.scrollView, {
		backgroundColor: 'transparent'
	}));
	self.win.add(self.scrollView);
	
	self.textArea = Titanium.UI.createTextArea(utils.merge(layout.textArea, {
		editable: false,
		font: style.font.huge,
		value: message,
		backgroundColor: 'transparent'
	}));
	self.scrollView.add(self.textArea);
	
	// Handle orientation.	
	function relayoutOverlayDialog(e) {
		var deviceLandscape = (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight);
		var windowLandscape = (self.win.width > self.win.height);
		if (deviceLandscape != windowLandscape) {
			// TIBUG: When we are not the top window, we get the orientation gesture but our window has not been automatically rotated for us.
			// We detect this by realizing that the windows orientation and the device orientation are not in line and reset.
			self.win.width = Ti.Platform.displayCaps.platformWidth;
			self.win.height = Ti.Platform.displayCaps.platformHeight - style.dim.navBarHeight - style.dim.statusBarHeight;
		}
	
		self.relayout();
	}
	self.win.addEventListener("close", function OverlayDialogClose(e) {
		Ti.Gesture.removeEventListener("orientationchange", relayoutOverlayDialog);
	});
	Ti.Gesture.addEventListener("orientationchange", relayoutOverlayDialog);

	self.win.open();
}

// External interface
OverlayDialog.prototype.open = open;
OverlayDialog.prototype.relayout = relayout;
module.exports = OverlayDialog;