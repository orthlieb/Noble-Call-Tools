var log = require('helpers/logger');

function NavigationController() {
	log.start();
	this.windowStack = [];
};

function open(/*Ti.UI.Window*/windowToOpen) {
	log.start();

	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);

	//grab a copy of the current nav controller for use in the callback
	var that = this;
	windowToOpen.addEventListener('close', function() {
		that.windowStack.pop();
	});
	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if(this.windowStack.length === 1) {
		if(Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			this.navGroup = Ti.UI.iPhone.createNavigationGroup({
				window : windowToOpen
			});
			var containerWindow = Ti.UI.createWindow();
			containerWindow.add(this.navGroup);
			containerWindow.open({
				transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		}
	} else {
		//All subsequent windows
		if(Ti.Platform.osname === 'android') {
			windowToOpen.open();
		} else {
			this.navGroup.open(windowToOpen);
		}
	}
}

// Go back to the initial window of the NavigationController
function home() {
	log.start();

	//store a copy of all the current windows on the stack
	var windows = this.windowStack.concat([]);
	for(var i = 1, l = windows.length; i < l; i++) {
		(this.navGroup) ? this.navGroup.close(windows[i]) : windows[i].close();
	}
	//reset stack
	this.windowStack = [this.windowStack[0]];
}

// External interface
NavigationController.prototype.open = open;
NavigationController.prototype.home = home;
module.exports = NavigationController;
