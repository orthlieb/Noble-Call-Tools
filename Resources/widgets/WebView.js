var NavigationController = require('widgets/NavigationController');

var log = require('lib/logger');
var style = require('ui/style');

var firstTime = true;

function WebView(/*String*/title, /*Array*/urlArray) {
    log.start();

    this.title = title;
    this.urlArray = urlArray;
}

function open(controller) {
    var self = this;
    var moreThanOnePage = self.urlArray.length > 1;
    var displayPagingArrows = false;
    switch (Ti.Platform.osname) {
        case 'iphone':
        case 'ipad':
            break;
        case 'android':
        case 'mobileweb':
            displayPagingArrows = true;
            break;
        case 'blackberry':
        default:
            log.assert(false, "Cross Platform code not implemented.");
            break;
    }

    // Need a window to host the view.
    var win = Ti.UI.createWindow({
        title : self.title,
        barColor : style.win.barColor,
        backButtonTitle : L('button_done'),
        backgroundImage : style.findImage('Background.png')
    });

    if (displayPagingArrows && moreThanOnePage) {
        // Views to hold next/previous indicators
        var prevButton = Ti.UI.createButton({
            left: style.gutter.size, bottom: 0, width: style.pagingControl.height, height: style.pagingControl.height,
            backgroundImage: style.findImage('LeftArrow.png'),
            backgroundDisabledImage: style.findImage('LeftArrowDisabled.png'),
            enabled: false
        });
        prevButton.addEventListener('click', function PrevButtonClicked(e) {
           scrollableView.movePrevious(); 
        });
        win.add(prevButton);
        var nextButton = Ti.UI.createButton({
            right: style.gutter.size, bottom: 0, width: style.pagingControl.height, height: style.pagingControl.height,
            backgroundImage: style.findImage('RightArrow.png'),
            backgroundDisabledImage: style.findImage('RightArrowDisabled.png'),
            enabled: true
        });
        nextButton.addEventListener('click', function PrevButtonClicked(e) {
           scrollableView.moveNext(); 
        });
        win.add(nextButton);
    }

    // Nice opaque effect in the background.
    var translucentView = Ti.UI.createView({
        left : style.gutter.size, top: style.gutter.size, 
        right: style.gutter.size, bottom: moreThanOnePage ? style.pagingControl.height : style.gutter.size,
        borderRadius : 5,
        borderWidth : 1,
        backgroundColor : style.win.backgroundColor,
        opacity : style.translucentView.opacity
    });
    win.add(translucentView);

    // Load up the views
    log.info('Number of sub views: ' + self.urlArray.length);
    var aViews = [];

    for(var j = 0; j < self.urlArray.length; j++) {
        aViews[j] = Ti.UI.createWebView({
            url : '/HTML/' + self.urlArray[j] + '.html',
            left: style.gutter.size, right: style.gutter.size,
            backgroundColor : 'transparent',
            scalesPageToFit : false
        });
    }

    // Create the scrollable view
    var scrollableView = Ti.UI.createScrollableView({
        left : style.gutter.size, top: style.gutter.size, 
        right: style.gutter.size, bottom: moreThanOnePage ? style.pagingControl.height : style.gutter.size,
        pagingControlColor : 'transparent',
        showPagingControl : moreThanOnePage && !displayPagingArrows,
        pagingControlHeight : moreThanOnePage ? style.pagingControl.height : 0,
        views : aViews,
        currentPage : 0
    });
    if (displayPagingArrows && moreThanOnePage) {
        scrollableView.addEventListener('scroll', function ScrollableViewScroll(e) {
                // Enable/disable the prev next buttons as the user pages through the views
                nextButton.enabled = (e.currentPage < (self.urlArray.length - 1));
                prevButton.enabled = (e.currentPage != 0);
        });
    }
    win.add(scrollableView);

    // Open in the Nav Controller.
    controller.open(win);
}

// Exports

WebView.prototype.open = open;
module.exports = WebView;
