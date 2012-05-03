var BibleModel = require('model/BibleModel');
var ui = require('ui/ui');
var style = require('ui/style');
var log = require('helpers/logger');
var ComboBox = require('widgets/ComboBox');
var OverlayDialog = require('widgets/OverlayDialog');

function BibleQuote(/*string*/version, /*string*/verse) {
	var self = this;

    // Go get the quote.
	var changeCallback = function(data) {
		if (self.textArea) {
			self.textArea.value = data.quote;
		}
		if (self.copyrightLabel) {
			self.copyrightLabel.text = self.bm.bibles[data.version].copyright;
			self.copyrightLabel.height = Ti.UI.SIZE;     // Resize the area in case it grows or shrinks
		}
		
		Titanium.App.Properties.setString('BibleVersion', data.version);	// Make it sticky.
	};
	
	var errorCallback = function(textStatus, errorThrown) {
		if (self.textArea) {
			self.textArea.value = 'Error ' + errorThrown + ': ' + textStatus;
		}
	};

	self.bm = new BibleModel(version, verse, changeCallback, errorCallback);
}

function BibleQuoteOpen(controller) {
	var self = this;
	
	log.start();

	var win = ui.window({
		backButtonTitle: L('button_done'),
		backgroundImage: style.findImage('Background.png'),
		barColor: style.win.barColor,
		title: self.bm.verse,
		layout: 'absolute'
	});

    function BibleQuoteInfo() {
        var od = new OverlayDialog({
            title : self.bm.bibles[self.bm.version].title,
            backgroundColor : style.win.backgroundColor,
            backgroundImage : style.findImage('Background.png'),
            barColor : style.win.barColor
        });
        od.open(self.bm.bibles[self.bm.version].description);
    }

    switch (Ti.Platform.osname) {
        case 'iphone':
        case 'ipad':
            // Info button for the selected bible.
            var infoButton = ui.button({
                id: 'info',
                systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT       
            });
            win.rightNavButton = infoButton;
            infoButton.addEventListener('click', BibleQuoteInfo);
        break;
        case 'android':
            win.activity.onCreateOptionsMenu = function(e) {
                var menu = e.menu;
                var menuItem = menu.add({
                    title : L('info'),
                    itemId : 0
                });
                menuItem.setIcon(style.findImage('info'));
                menuItem.addEventListener('click', BibleQuoteInfo);
            };    
        break;
        default:
            // XXX Add Blackberry, Windows, Mobile Web
            log.assert(false, "Unsupported platform");
        break;
    }        

    // List of bibles to choose from.
    var comboBox = new ComboBox(win, {
        left: ui.dim.gutter,
        top: ui.dim.gutter,
        right: ui.dim.gutter,
        height: Ti.UI.SIZE,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		editable: false,
		value: self.bm.bibles[self.bm.version].title
	});		
	win.add(comboBox);
	comboBox.addEventListener('change', function(e) { 
		self.bm.setVersionVerse(self.bm.lookupVersion(e.value), self.bm.verse);
	});
    // Load the picker with data, figure out which one is selected. 
    var selected = 0;
    var count = 0;
    var data = [];
    for (var i in self.bm.bibles) {
        if (self.bm.bibles.hasOwnProperty(i)) {
            var pickerRow = Titanium.UI.createPickerRow({
                id: i,
                title: self.bm.bibles[i].title
            });
            if (self.bm.version == i) {
                selected=count;
            }
            count++;
            data.push(pickerRow);
        }
    }
    comboBox.picker.add(data);
    comboBox.picker.setSelectedRow(0, selected);

    // Nice opaque effect in the background.
    var translucentView = Titanium.UI.createView({
        left: ui.dim.gutter,
        top: ui.dim.gutter,
        right: ui.dim.gutter,
        bottom: ui.dim.gutter,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: style.win.backgroundColor,
        opacity: style.translucentView.opacity  
    });
    win.add(translucentView);

	self.textArea = Titanium.UI.createTextArea({
        left: ui.dim.gutter,
        top: ui.dim.gutter,
        right: ui.dim.gutter,
        bottom: ui.dim.gutter,
		editable: false,
		font: style.font.huge,
		value: self.bm.quote,
		backgroundColor: 'transparent'
	});
	win.add(self.textArea);

    self.copyrightLabel = Titanium.UI.createLabel({
        left: ui.dim.gutter,
        right: ui.dim.gutter,
        bottom: ui.dim.gutter,
        height: Ti.UI.SIZE,
        backgroundColor: 'transparent',
        font: style.font.tiny,
        textAlign: 'center',
        color: style.label.color,
        text: self.bm.bibles[self.bm.version].copyright
    });
    win.add(self.copyrightLabel);
    
    win.addEventListener('postlayout', function (e) {
        // Only want to relay out if our dependent items change
        if (e.source == comboBox || e.source == self.copyrightLabel) {
            var top = comboBox.size.height + ui.dim.gutter * 2;
            var bottom = self.copyrightLabel.size.height + ui.dim.gutter * 2;
            self.textArea.updateLayout({
                top: top,
                bottom: bottom  
            });
            translucentView.updateLayout({
                top: top,
                bottom: bottom
            });
            log.info('Resizing top/bottom ' + translucentView.top + '/' + translucentView.bottom);
        }
    });
   
	controller.open(win);	// Add to the Nav controller.
}

BibleQuote.prototype.open = BibleQuoteOpen;
module.exports = BibleQuote;
