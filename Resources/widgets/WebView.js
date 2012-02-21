var NavigationController = require('widgets/NavigationController');

var log = require('helpers/logger');
var ui = require('ui');
var style = require('ui/style');
var utils = require('helpers/utils');

var firstTime = true;

function WebView(/*String*/title, /*Array*/urlArray) {
	log.start();
	
	this.title = title;
	this.urlArray = urlArray;
}

// Gets all the applicable sizes based on the current size of the screen, used for initial layout and handling rotation
function getLayout(/*TiUIWindow*/parentWindow, /*boolean*/displayPagingControl, /*boolean*/creation) {	
	log.start();
	
	var top = style.dim.gutter;
	var left = style.dim.gutter;
  	// TIBUG: When creating a window, the status bar is there but the navBar isn't on rotation it is there.
	var bottom = parentWindow.height - (creation ? style.dim.navBarHeight : 0); 
	var width = parentWindow.width - style.dim.gutter * 2;
	
	var layout = {
		translucentView: {
			top: top,
			left: left,
			width: width,
			height:  bottom - top - (displayPagingControl ? style.dim.pagingControlHeight : style.dim.gutter)
		},
		scrollableView: {
			top:  top,
			left: left + style.dim.gutter,
			width: width - style.dim.gutter * 2,
			height: bottom - top - (displayPagingControl ? 0 : style.dim.gutter)
		}
	};
	
	return layout;
}

function relayout() {
	var self = this;
	var obj = getLayout(self.win, self.urlArray.length > 1, false);
	
	for (var i in obj) {
		for (var j in obj[i]) {
			self[i][j] = obj[i][j];
		}
	}
}

function open(controller) {
	var self = this;
	
	// Need a window to host the view.
	self.win = ui.window({
		title : self.title,
		barColor : style.color.navBar,
		backButtonTitle : L('button_done'),
		backgroundImage : style.image.portrait.webView,
	});

	var layout = getLayout(self.win, self.urlArray.length > 1, true);

	// Nice opaque effect in the background.
	self.translucentView = Ti.UI.createView(utils.merge(layout.translucentView, {
		borderRadius: 5,
		borderWidth: 1,
		backgroundColor: style.color.backgroundColor,
		opacity: style.opacity.translucentView
	}));
	self.win.add(self.translucentView);

	// Load up the views
	log.info('Number of sub views: ' + self.urlArray.length);
	var aViews = [];

	for(var j = 0; j < self.urlArray.length; j++) {
		aViews[j] = Ti.UI.createWebView({
			url : 'HTML/' + self.urlArray[j] + '.html',
			backgroundColor : 'transparent',
			scalesPageToFit: false
		});
	}

	// Create the scrollable view
	self.scrollableView = Ti.UI.createScrollableView(utils.merge(layout.scrollableView, {
		pagingControlColor : 'transparent',
		showPagingControl : self.urlArray.length > 1,
		pagingControlHeight : self.urlArray.length > 1 ? style.dim.pagingControlHeight : 0,
		views : aViews,
		currentPage : 0
	}));
	self.win.add(self.scrollableView);

	// Handle orientation.	
	function relayoutWebView(e) {
		var deviceLandscape = (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight);
		var windowLandscape = (self.win.width > self.win.height);
		if (deviceLandscape != windowLandscape) {
			// TIBUG: When we are not the top window, we get the orientation gesture but our window has not been automatically rotated for us.
			self.win.width = Ti.Platform.displayCaps.platformWidth;
			self.win.height = Ti.Platform.displayCaps.platformHeight - style.dim.navBarHeight - style.dim.statusBarHeight;
		}

		self.relayout();
	}
	self.win.addEventListener("close", function webViewClose(e) {
		Ti.Gesture.removeEventListener("orientationchange", relayoutWebView);
	});
	Ti.Gesture.addEventListener("orientationchange", relayoutWebView);
	
	// Open in the Nav Controller.
	controller.open(self.win);
}

// Exports
WebView.prototype.relayout = relayout;
WebView.prototype.open = open;
module.exports = WebView;
