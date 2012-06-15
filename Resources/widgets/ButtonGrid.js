// === Button Grid View
// A grid of buttons in a scroll view.
// @viewWidth		integer	Width of the view (height is 'auto')
// @buttons			array	Array button structs with the following properties [ {
//                              id: unique string
//                              title: string denoting the title/label on the button suitable for display
//                              image: image to display (should be in images/<image>Normal.png and images/<image>Selected.png)
//                              offset: offset in pixels from the bottom of the button for the label (useful for adjusting 1 vs 2 line labels)
//                          } ]
// @dimButtons		array       Array of w, h that defines the dimensions of the button image
// XXX Might want to change this to be just the number of buttons to have across and a gutter?
// @click           function    Function to call when a button is clicked.
// returns: button grid object

var log = require('lib/logger');
var style = require('ui/style');

function ButtonGrid(viewWidth, buttons, dimButtons, click) {
	log.start();

	this.click = click;
    this.buttons = [];
    this.dimButton = dimButtons;
    
    this.scrollview = Ti.UI.createScrollView({
		contentWidth: Ti.UI.FILL,
		contentHeight:'auto',
		left: 0, top: 0, right: 0, bottom: 0,
		showVerticalScrollIndicator: true
    });
   
    var j = 0;
    for (var i in buttons) {
		if (buttons.hasOwnProperty(i)) {
		    log.info('Creating button ' + i);
		    
		    var buttonProps = {
		       center: { x: '50%', y: '50%' },    
		       id: i,
		       backgroundImage: style.findImage(buttons[i].image + 'Normal.png'),
		       backgroundSelectedImage: style.findImage(buttons[i].image + 'Selected.png'),
		       width: this.dimButton.w,
		       height: this.dimButton.h
		    };
		    
		    if (Ti.Platform.osname == "android"|| Ti.Platform.osname == "mobileweb") {
                // TIBUG: On Android we can add a label to a button and align it to the bottom. The vertical align doesn't work on iOS.
                buttonProps.title = buttons[i].text;
                buttonProps.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
				buttonProps.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
				buttonProps.font = style.font.small;
				buttonProps.color = style.label.color;
                buttonProps.selectedColor = style.button.selectedColor;
		    }
		    
		    var button = Ti.UI.createButton(buttonProps);
			this.buttons[j] = button;		   
            if (typeof(this.click) != "undefined") {
				this.buttons[j].addEventListener('click', this.click);
		    }
		    this.scrollview.add(this.buttons[j]);
		    
		    if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad" ) {
                // TIBUG: On iOS we need to place the text label into the button proper. 
                var theLabel = Ti.UI.createLabel({
                    color: style.label.color,
                    backgroundColor: 'transparent',
                    width: this.dimButton.w,
                    height:Ti.UI.SIZE,
                    bottom: buttons[i].offset,
                    font: style.font.small,
                    text: buttons[i].text,
                    textAlign: 'center',
                    touchEnabled: false
                });
                
                this.buttons[j].add(theLabel);					
            }

			j++;
		}
    }
    log.info('ButtonGrid: total of ' + this.buttons.length + ' buttons in this grid');
}

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

    var layoutCursor = { x: gutter, y: gutter };
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
}

ButtonGrid.prototype.relayout = relayout;
module.exports = ButtonGrid;