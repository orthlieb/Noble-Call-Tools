// === Button Grid View
// A grid of buttons in a scroll view.
// @viewWidth		integer	    Width of the view (height is 'auto')
// @buttons			object	    Object contining button structs with the following properties 
//                              id: {
//                                  title: string denoting the title/label on the button suitable for display
//                                  image: image to display (should be in images/<image>Normal.png and images/<image>Selected.png)
//                                  offset: offset in pixels from the bottom of the button for the label (useful for adjusting 1 vs 2 line labels)
//                              }
// @click           function    Function to call when a button is clicked.
// returns: button grid object

var log = require('lib/logger');
var style = require('ui/style');

function ButtonGrid(args) {
    log.start();

    var buttons = args.buttons;
    this.buttonWidth = args.buttonWidth;
    this.buttonHeight = args.buttonHeight;

    this.buttons = [];

    // Scrollview holds our buttons in the button grid.    
    this.scrollview = Ti.UI.createScrollView({
		contentWidth: Ti.UI.FILL,
		contentHeight:'auto',
        backgroundImage : style.findImage('BackgroundTile.png'),
        backgroundRepeat: true,
		left: 0, top: 0, right: 0, bottom: 0,
		showVerticalScrollIndicator: true
    });
  
    var i, j = 0;
    for (i in args.buttons) {
		if (args.buttons.hasOwnProperty(i)) {
		    log.info('Creating button ' + i);
		       
		    var buttonProps = {
		       center: { x: '50%', y: '50%' },    
		       id: i,
		       backgroundImage: style.findImage(args.buttons[i].image + 'Normal.png'),
		       backgroundSelectedImage: style.findImage(args.buttons[i].image + 'Selected.png'),
		       width: this.buttonWidth,
		       height: this.buttonHeight
		    };
		    
		    if (Ti.Platform.osname == "android"|| Ti.Platform.osname == "mobileweb") {
                // TIBUG: On Android we can add a label to a button and align it to the bottom. The vertical align doesn't work on iOS.
                buttonProps.title = args.buttons[i].text + ((args.buttons[i].offset > 5) ? '\n' : '');
                buttonProps.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
				buttonProps.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
				buttonProps.font = style.font.small;
				buttonProps.color = style.label.color;
                buttonProps.selectedColor = style.button.selectedColor;
		    }
		    
		    var button = Ti.UI.createButton(buttonProps);
			this.buttons[j] = button;		   
            if (typeof(args.click) != "undefined") {
				this.buttons[j].addEventListener('click', args.click);
		    }
		    this.scrollview.add(this.buttons[j]);
		    
		    if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad" ) {
                // TIBUG: On iOS we need to place the text label into the button proper. 
                var theLabel = Ti.UI.createLabel({
                    color: style.label.color,
                    backgroundColor: 'transparent',
                    width: this.buttonWidth,
                    height:Ti.UI.SIZE,
                    bottom: args.buttons[i].offset,
                    font: style.font.small,
                    text: args.buttons[i].text,
                    textAlign: 'center',
                    touchEnabled: false
                });
                
                this.buttons[j].add(theLabel);					
            }

			j++;
		}
    }
    log.info('ButtonGrid: total of ' + this.buttons.length + ' buttons in this grid');
    
    return this;
}

function relayout(viewWidth) {
	// Should be called after instantiation first time to display the button grid and
    // on any subsequent reorientation of the device.
    log.start();
     
    // Modify the width of the overall scroll view
    this.scrollview.contentWidth = viewWidth;
    this.scrollview.contentHeight = 'auto';

    // Calculate the new gutter.
    var across = Math.floor(viewWidth / this.buttonWidth);
    var gutter = (viewWidth - (this.buttonWidth * across)) / (across + 1);

    log.info('ButtonGrid: Layout across = ' + across + ' gutter = ' + gutter + ', laying out ' + this.buttons.length + ' buttons ');

    // Start laying out the buttons.
    var layoutCursor = { x: gutter, y: gutter / 2 }, i;
	for (i = 0; i < this.buttons.length; i++) {
	    this.buttons[i].animate({
			left: layoutCursor.x,
			top: layoutCursor.y,
			duration: 1000
	    });
   
	    log.info("ButtonGrid: Layout button (" + layoutCursor.x + ', ' + layoutCursor.y + ')');
	
	    // Detect wrap around.
	    layoutCursor.x += this.buttonWidth + gutter;
	    if (layoutCursor.x >= viewWidth) {
			layoutCursor.x = gutter;
			layoutCursor.y += this.buttonHeight + gutter;
	    }
	}
}

ButtonGrid.prototype.relayout = relayout;
module.exports = ButtonGrid;