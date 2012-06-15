var log = require('lib/logger');
var style = require('ui/style');

// Main Class: creates a window to use as an Overlay dialog.
function OverlayDialog(/*Window args*/args) {
	log.start();
	var self = this;
	
	args.top = 0;
	args.left = 0;
	args.width = Ti.Platform.displayCaps.width;
	args.height = Ti.Platform.displayCaps.height;
	args.layout = 'absolute';
	args.modal = true;
	
	self.win = Ti.UI.createWindow(args);
	
	return self;
}

function open(/* Text */message) {
	log.start();
	
	var self = this;
	
	var translucentView = Ti.UI.createView({
        top: style.gutter.size, left: style.gutter.size, right: style.gutter.size, bottom: style.gutter.size,
		backgroundColor: style.win.backgroundColor,
		opacity: style.translucentView.opacity,
		borderRadius: 5,
		borderWidth: 1
	});
	self.win.add(translucentView);
	
	var textArea = Titanium.UI.createTextArea({
        top: style.gutter.size, left: style.gutter.size, right: style.gutter.size, bottom: style.button.height + style.gutter.size * 2,
		editable: false,
		font: style.font.huge,
		value: message,
		backgroundColor: 'transparent'
	});
	self.win.add(textArea);

    var okButton = Ti.UI.createButton({
        bottom: style.gutter.size,
        width: '33%',
        height:  style.button.height,
        title: L('button_ok')
    });
    self.win.add(okButton);
    okButton.addEventListener('click',function() {
        self.win.close();
    }); 

    okButton.addEventListener('postlayout', function (e) {
        var bottom = okButton.size.height + style.gutter.size * 2;
        textArea.updateLayout({
             bottom: bottom  
        });
        translucentView.updateLayout({
            bottom: bottom
        });
    });

	self.win.open();
}

// External interface
OverlayDialog.prototype.open = open;
module.exports = OverlayDialog;