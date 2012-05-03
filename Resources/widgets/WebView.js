var NavigationController = require('widgets/NavigationController');

var log = require('helpers/logger');
var ui = require('ui/ui');
var style = require('ui/style');

var firstTime = true;

function WebView(/*String*/title, /*Array*/urlArray) {
    log.start();

    this.title = title;
    this.urlArray = urlArray;
}

function open(controller) {
    var self = this;

    // Need a window to host the view.
    var win = ui.window({
        title : self.title,
        barColor : style.win.barColor,
        backButtonTitle : L('button_done'),
        backgroundImage : style.findImage('Background.png')
    });

    // Nice opaque effect in the background.
    var displayPagingControl = self.urlArray.length > 1;
    var translucentView = Ti.UI.createView({
        left : ui.dim.gutter, top: ui.dim.gutter, right: ui.dim.gutter, bottom: displayPagingControl ? ui.dim.pagingControlHeight : ui.dim.gutter,
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
            backgroundColor : 'transparent',
            scalesPageToFit : false
        });
    }

    // Create the scrollable view
    var scrollableView = Ti.UI.createScrollableView({
        left : ui.dim.gutter, top: ui.dim.gutter, right: ui.dim.gutter, bottom: displayPagingControl ? 0 : ui.dim.gutter,
        pagingControlColor : 'transparent',
        showPagingControl : displayPagingControl,
        pagingControlHeight : displayPagingControl ? ui.dim.pagingControlHeight : 0,
        views : aViews,
        currentPage : 0
    });
    win.add(scrollableView);

    // Open in the Nav Controller.
    controller.open(win);
}

// Exports

WebView.prototype.open = open;
module.exports = WebView;
