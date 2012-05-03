var log = require('helpers/logger');
var style = require('ui/style');
var ui = require('ui/ui');

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
	
	self.win = ui.window(args);
	
	return self;
}

function open(/* Text */message) {
	log.start();
	
	var self = this;
	
	var translucentView = ui.view({
        top: ui.dim.gutter, left: ui.dim.gutter, right: ui.dim.gutter, bottom: ui.dim.gutter,
		backgroundColor: style.win.backgroundColor,
		opacity: style.translucentView.opacity,
		borderRadius: 5,
		borderWidth: 1
	});
	self.win.add(translucentView);
	
	var textArea = Titanium.UI.createTextArea({
        top: ui.dim.gutter, left: ui.dim.gutter, right: ui.dim.gutter, bottom: ui.dim.gutter,
		editable: false,
		font: style.font.huge,
		value: message,
		backgroundColor: 'transparent'
	});
	self.win.add(textArea);

    var okButton =  ui.button({
        bottom: ui.dim.gutter,
        width: '33%',
        height:  Ti.UI.SIZE,
        title: L('button_ok')
    });
    self.win.add(okButton);
    okButton.addEventListener('click',function() {
        self.win.close();
    }); 

    okButton.addEventListener('postlayout', function (e) {
        var bottom = okButton.size.height + ui.dim.gutter * 2;
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