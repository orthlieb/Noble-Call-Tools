//
// === Button Grid View
// A grid of buttons in a scroll view.
// @viewWidth		integer	Width of the view (height is 'auto')
// @buttons			array	Array button structs with the following properties [ {
//                              id: unique string
//                              title: string denoting the title/label on the button suitable for display
//                              image: image to display (should be in images/<image>Normal.png and images/<image>Selected.png)
//                              offset: offset in pixels from the bottom of the button for the label (useful for adjusting 1 vs 2 line labels)
//                          } ]
// @dimButtons		array	Array of w, h for the button image
// @click			function 	Function to call when the button is clicked.
// returns: button grid object

var log = require('helpers/logger');
var style = require('ui/style');
var utils = require('helpers/utils');

function ButtonGrid(viewWidth, buttons, dimButtons, click) {
	log.start();

	this.click = click;
    this.buttons = new Array();
    this.dimButton = dimButtons;
    
    this.scrollview = Ti.UI.createScrollView({
		contentWidth: Ti.Platform.displayCaps.platformWidth,
		contentHeight:'auto',
		top: 0,
		left: 0,
		height: Ti.Platform.displayCaps.platformHeight,// - style.dim.statusBarHeight, // xxx
		showVerticalScrollIndicator: true
    });
   
   
    var j = 0;
    for (var i in buttons) {
		if (buttons.hasOwnProperty(i)) {
		    log.info('Creating button ' + i);
		    var button = Ti.UI.createButton({
		       id: i,
		       backgroundImage: utils.resourceDir('image') + style.name + '/' + buttons[i].image + 'Normal.png',
		       backgroundSelectedImage: utils.resourceDir('image') + style.name + '/' + buttons[i].image + 'Selected.png',
		       width: this.dimButton.w,
		       height: this.dimButton.h
		    });
			this.buttons[j] = button;
		   
		    if (this.click != null) {
				this.buttons[j].addEventListener('click', this.click);
		    }
		    
		    var theLabel = Ti.UI.createLabel({
				color: style.color.labelColor,
				highlightedColor: style.color.buttonHighlight,
				backgroundColor: 'transparent',
				width: this.dimButton.w,
				height:'auto',
				bottom: buttons[i].offset,
				font: style.font.small,
				text: buttons[i].text,
				textAlign: 'center',
				touchEnabled: false
		    });
		
		    this.buttons[j].add(theLabel);
		    this.scrollview.add(this.buttons[j++]);
		}
    }
    log.info('ButtonGrid: total of ' + this.buttons.length + ' buttons in this grid');
};

function relayout(viewWidth) {
	// Should be called after instantiation first time to display the button grid and
    // on any subsequent reorientation of the device.
    log.start();
     
    // Modify the width of the overall scroll view
    this.scrollview.contentWidth = viewWidth;
    this.scrollview.contentHeight = 'auto';

    // Set up the layout information.
    var numButtonsAcross = Math.floor(viewWidth / this.dimButton.w);
    var gutter = (viewWidth - (numButtonsAcross * this.dimButton.w)) / (numButtonsAcross + 1);
    log.info('ButtonGrid: Layout gutter = ' + gutter + ', laying out ' + this.buttons.length + ' buttons ' + numButtonsAcross + ' across.');

    var layoutCursor = { x: gutter, y: gutter / 2 };
	for (var i = 0; i < this.buttons.length; i++) {
	    this.buttons[i].animate({
			left: layoutCursor.x,
			top: layoutCursor.y,
			duration: 2000
	    });
   
	    log.info("ButtonGrid: Layout button (" + layoutCursor.x + ', ' + layoutCursor.y + ')');
	
	    // Detect wrap around.
	    layoutCursor.x += this.dimButton.w + gutter;
	    if (layoutCursor.x >= viewWidth) {
			layoutCursor.x = gutter;
			layoutCursor.y += this.dimButton.h + gutter;
	    }
	}
};

ButtonGrid.prototype.relayout = relayout;
module.exports = ButtonGrid;