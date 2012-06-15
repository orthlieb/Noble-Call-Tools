var log = require('lib/logger');
var style = require('ui/style');

// Main Class: adds an info button to a window.
function InfoButton()
{
    return this;
}

function InfoButtonAttach(/*TiUIWindow*/parent, /*function*/click) {
	log.start();
	var self = this;
	
    switch (Ti.Platform.osname) {
        case 'iphone':
        case 'ipad':
            // Info button for the selected bible.
            var infoButton = Ti.UI.createButton({
                id: 'info',
                systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT       
            });
            infoButton.addEventListener('click', click);
            parent.rightNavButton = infoButton;
        break;
        case 'android':
            parent.activity.onCreateOptionsMenu = function createOptionsMenu(e) {
                var menu = e.menu;
                var menuItem = menu.add({
                    title : L('info'),
                    itemId : 0
                });
                menuItem.setIcon(style.findImage('info'));
                menuItem.addEventListener('click', click);
            };    
        break;
        default:
            // XXX Add Blackberry, Windows, Mobile Web
            log.assert(false, "Unsupported platform");
        break;
    }  
	
	return self;
}

// External interface
InfoButton.prototype.attach = InfoButtonAttach;
module.exports = InfoButton;