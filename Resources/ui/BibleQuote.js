var BibleModel = require('model/BibleModel');
var style = require('ui/style');
var log = require('lib/logger');
var ComboBox = require('widgets/ComboBox');
var OverlayDialog = require('widgets/OverlayDialog');
var _ = require('lib/underscore');

function BibleQuote(/*string*/version, /*string*/verse) {
	var self = this;

    // Go get the quote.
	var changeCallback = function(data) {
		if (self._textArea) {
			self._textArea.value = data.quote;
		}
		if (self._copyrightLabel) {
			self._copyrightLabel.text = self.bm.bibles[data.version].copyright;
			self._copyrightLabel.height = Ti.UI.SIZE;     // Resize the area in case it grows or shrinks
		}
		
		Titanium.App.Properties.setString('BibleVersion', data.version);	// Make it sticky.
	};
	
	var errorCallback = function(textStatus, errorThrown) {
		if (self._textArea) {
			self._textArea.value = 'Error ' + errorThrown + ': ' + textStatus;
		}
	};

	self.bm = new BibleModel(version, verse, changeCallback, errorCallback);
}

function BibleQuoteOpen(controller) {
	var self = this;
	
	log.start();

	var win = Ti.UI.createWindow({
		backButtonTitle: L('button_done'),
		barColor: style.win.barColor,
		title: self.bm.verse,
		layout: 'absolute'
	});

    // Only here because windows don't support repeating backgrounds.
    var view = Ti.UI.createView({
        left: 0, top: 0, right: 0, bottom: 0,
        backgroundImage: style.findImage('BackgroundTile.png'),
        backgroundRepeat: true        
    });
    win.add(view);

    function BibleQuoteInfo() {
        var od = new OverlayDialog({
            title : self.bm.bibles[self.bm.version].title,
            backgroundColor : 'black',
            barColor : style.win.barColor
        });
        od.open(self.bm.bibles[self.bm.version].description);
    }
    var InfoButton = require('widgets/InfoButton');
    var infoButton = new InfoButton();
    infoButton.attach(win, BibleQuoteInfo);
  
    // List of bibles to choose from.
    var comboBox = new ComboBox(win, {
        left: style.gutter.size,
        top: style.gutter.size,
        right: style.gutter.size,
        height: style.comboBox.height,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	    editable: false,
		font: style.font.medium,
	    color: style.textField.color
	}, _.values(self.bm.bibles), self.bm.version);		
	comboBox.addEventListener('change', function bibleChanged(e) { 
		self.bm.setVersionVerse(e.value, self.bm.verse);
	});
    win.add(comboBox.view);
 
    // Nice opaque effect in the background.
    var translucentView = Titanium.UI.createView({
        left: style.gutter.size,
        top: style.gutter.size * 2 + style.textField.height,
        right: style.gutter.size,
        bottom: style.gutter.size + style.textField.height,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: style.win.backgroundColor,
        opacity: style.translucentView.opacity  
    });
    win.add(translucentView);

	self._textArea = Titanium.UI.createTextArea({
        left: style.gutter.size,
        top: style.gutter.size * 2 + style.textField.height,
        right: style.gutter.size,
        bottom: style.gutter.size + style.textField.height,
		editable: false,
		font: style.font.huge,
		value: self.bm.quote,
		backgroundColor: 'transparent'
	});
	win.add(self._textArea);

    self._copyrightLabel = Titanium.UI.createLabel({
        left: style.gutter.size,
        right: style.gutter.size,
        bottom: style.gutter.size,
        height: Ti.UI.SIZE,
        backgroundColor: 'transparent',
        font: style.font.tiny,
        textAlign: 'center',
        color: style.label.color,
        text: self.bm.bibles[self.bm.version].copyright
    });
    win.add(self._copyrightLabel);
    
	controller.open(win);	// Add to the Nav controller.
}

BibleQuote.prototype.open = BibleQuoteOpen;
module.exports = BibleQuote;
