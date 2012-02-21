var BibleModel = require('model/BibleModel');
var ui = require('ui');
var style = require('ui/style');
var log = require('helpers/logger');
var ComboBox = require('widgets/ComboBox');
var OverlayDialog = require('widgets/OverlayDialog');
var utils = require('helpers/utils');

// Gets all the applicable sizes based on the current size of the screen, used for initial layout and handling rotation
function getLayout(/*TiUIWindow*/parentWindow, /*boolean*/creation) {	
	var top = style.dim.gutter;
	var left = style.dim.gutter;
	var bottom = parentWindow.height - style.dim.gutter - (creation ? style.dim.navBarHeight : 0); // Work around a bug in Ti
	var width = parentWindow.width - style.dim.gutter * 2;
	
	var layout = {};
	
	layout.comboBox = {
		left: left,
		top: top,
		width: width,
		height: style.dim.textFieldHeight,
	};
	
	top += layout.comboBox.height + style.dim.gutter;	
	
	layout.copyrightLabel = {
		left: left,
		top: bottom - style.font.tiny.fontSize - 3,
		width: width,
		height: style.font.tiny.fontSize + 3,
	};

	bottom = layout.copyrightLabel.top - style.dim.gutter;
	
	layout.translucentView = {
		left: left,
		top: top,
		width: width,
		height: bottom - top,
	};
	
	layout.scrollView = {
		left: left,
		top: top,
		width: width,
		height: bottom - top,
		contentWidth: width,
	};

	layout.textArea = {
		top: 0,
		left: 0,
		width: width
	};
	
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

function BibleQuote(/*string*/version, /*string*/verse) {
	var self = this;
	
	// Go get the quote.
	var changeCallback = function(data) {
		if (self.textArea)
			self.textArea.value = data.quote;
		if (self.copyrightLabel)
			self.copyrightLabel.text = self.bm.bibles[data.version].copyright;
		
		Titanium.App.Properties.setString('BibleVersion', data.version);	// Make it sticky.
	};
	var errorCallback = function(textStatus, errorThrown) {
		if (self.textArea)
			self.textArea.value = 'Error ' + errorThrown + ': ' + textStatus;
	};

	self.bm = new BibleModel(version, verse, changeCallback, errorCallback);
};

function open(controller) {
	var self = this;
	
	log.start();

	self.win = ui.window({
		backButtonTitle: L('button_done'),
		backgroundImage: style.image.portrait.bibleQuote,
		barColor: style.color.navBar,
		orientationModes: [ Ti.UI.PORTRAIT ],
		title: self.bm.verse
	});
	
	var infoButton = ui.button({
	    id: 'info',
		systemButton:Titanium.UI.iPhone.SystemButton.INFO_LIGHT	    
	});
	self.win.rightNavButton = infoButton;
	infoButton.addEventListener('click',function() {
		var od = new OverlayDialog({
			title: self.bm.bibles[self.bm.version].title,
			backgroundColor: style.color.backgroundColor,
			backgroundImage: style.image.portrait.overlayDialog,
			barColor: style.color.navBar,
		});
		od.open(self.bm.bibles[self.bm.version].description);
	});

	var layout = getLayout(self.win, true);
	
	self.comboBox = new ComboBox(self.win, utils.merge(layout.comboBox, {
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		editable: false,
		value: self.bm.bibles[self.bm.version].title,
	}));		
	self.win.add(self.comboBox);
	self.comboBox.addEventListener('change', function(e) { 
		self.bm.setVersionVerse(self.bm.lookupVersion(e.value), self.bm.verse);
	});

	self.copyrightLabel = Titanium.UI.createLabel(utils.merge(layout.copyrightLabel, {
		backgroundColor: 'transparent',
		font: style.font.tiny,
		textAlign: 'center',
		text: self.bm.bibles[self.bm.version].copyright
	}));
	self.win.add(self.copyrightLabel);
	
	// Load the picker with data, figure out which one is selected.	
	var selected = 0;
	var count = 0;
	var data = [];
	for (var i in self.bm.bibles) {
		var pickerRow = Titanium.UI.createPickerRow({
			id: i,
			title: self.bm.bibles[i].title
		});
		if (self.bm.version == i)
			selected=count;
		count++;
		data.push(pickerRow);
	}
	self.comboBox.picker.add(data);
	self.comboBox.picker.setSelectedRow(0, selected);
	
	// Nice opaque effect in the background.
	self.translucentView = Titanium.UI.createView(utils.merge(layout.translucentView, {
		borderRadius: 5,
		borderWidth: 1,
		backgroundColor: style.color.backgroundColor,
		opacity: style.opacity.translucentView	
	}));
	self.win.add(self.translucentView);

	self.scrollView = Ti.UI.createScrollView(utils.merge(layout.scrollView, {
		contentHeight: 'auto',	
		backgroundColor: 'transparent'
	}));
	self.win.add(self.scrollView);
	
	self.textArea = Titanium.UI.createTextArea(utils.merge(layout.textArea, {
		editable: false,
		font: style.font.huge,
		value: self.bm.quote,
		backgroundColor: 'transparent'
	}));
	self.scrollView.add(self.textArea);

	// Handle orientation.	
	function relayoutBibleQuote(e) {
		var deviceLandscape = (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight);
		var windowLandscape = (self.win.width > self.win.height);
		if (deviceLandscape != windowLandscape) {
			// TIBUG: When we are not the top window, we get the orientation gesture but our window has not been automatically rotated for us.
			// We detect this by realizing that the window's orientation and the device orientation are not in line and reset.
			self.win.width = Ti.Platform.displayCaps.platformWidth;
			self.win.height = Ti.Platform.displayCaps.platformHeight - style.dim.navBarHeight - style.dim.statusBarHeight;
		}

		self.relayout();
	}
	self.win.addEventListener("close", function bibleQuoteClose(e) {
		Ti.Gesture.removeEventListener("orientationchange", relayoutBibleQuote);
	});
	Ti.Gesture.addEventListener("orientationchange", relayoutBibleQuote);

	controller.open(self.win);	// Add to the Nav controller.
};

BibleQuote.prototype.open = open;
BibleQuote.prototype.relayout = relayout;
module.exports = BibleQuote;
