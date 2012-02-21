// Styles
var fontFamily = {
	serif : (Ti.Platform.osname == 'android') ? 'Serif' : 'Georgia',
	sans : (Ti.Platform.osname == 'android') ? 'Sans' : 'Helvetica Neue',
};

var styles = {
	linen : {
		// Colors
		color : {
			navBar : '#807759', // Putty
			buttonHighlight : '#e5af31', // Gold
			backgroundColor : '#f1e9cf', // Light tan
			darkBackgroundColor : '#464031', // Dark brown
			labelColor : '#fff', // White
			pageControlColor : '#464031', // Dark brown
			textColor : '#464031'				// Dark brown
		},

		opacity : {
			translucentView: 0.1
		},

		fontFamily: fontFamily,

		font : {
			tiny : {
				fontSize : 8,
				fontFamily : fontFamily.sans
			},
			small : {
				fontSize : 10,
				fontFamily : fontFamily.sans
			},
			medium : {
				fontSize : 14,
				fontFamily : fontFamily.sans
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			large : {
				fontSize : 16,
				fontFamily : fontFamily.sans
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			huge : {
				fontSize : 18,
				fontFamily : fontFamily.sans
			} //shadowColor:'black', shadowOffset:{x:0,y:1}
		},

		dim : {
			statusBarHeight : 21,
			navBarHeight : (Ti.Platform.osname == 'android') ? 0 : 44,
			pagingControlHeight : 30,
			gutter : 10,
			textFieldHeight : 35
		},

		picker : {
			height : 251,
			top : 43
		},

		image : {
			portrait : {
				bibleQuote : 'images/linen/LinenPortrait.png',
				courageousView : 'images/linen/LinenPortrait.png',
				mainWindow : 'images/linen/LinenPortrait.png',
				overlayDialog : 'images/linen/LinenPortrait.png',
				webView : 'images/linen/LinenPortrait.png'
			},
			pillButton : 'images/linen/PillButton.png'
		}
	},
	leather : {
		// Colors
		color : {
			navBar : '#515151', // Gray
			buttonHighlight : '#e5af31', // Gold
			backgroundColor : '#D1D1D1', // Light gray
			darkBackgroundColor : '#414141', // Dark brown
			labelColor : '#fff', // White
			pageControlColor : '#414141', // Dark brown
			textColor : '#F0F0F0'				// Black
		},

		opacity : {
			translucentView: 0.4
		},

		fontFamily: fontFamily,


		font : {
			tiny : {
				fontSize : 8,
				fontFamily : fontFamily.sans
			},
			small : {
				fontSize : 10,
				fontFamily : fontFamily.sans
			},
			medium : {
				fontSize : 14,
				fontFamily : fontFamily.sans
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			large : {
				fontSize : 16,
				fontFamily : fontFamily.sans
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			huge : {
				fontSize : 18,
				fontFamily : fontFamily.sans
			} //shadowColor:'black', shadowOffset:{x:0,y:1}
		},

		dim : {
			statusBarHeight : 21,
			navBarHeight : (Ti.Platform.osname == 'android') ? 0 : 43,
			pagingControlHeight : 30,
			gutter : 10,
			textFieldHeight : 35
		},

		picker : {
			height : 251,
			top : 43
		},

		image : {
			portrait : {
				bibleQuote : 'images/leather/LeatherPortrait.png',
				courageousView : 'images/leather/LeatherPortrait.png',
				mainWindow : 'images/leather/LeatherPortrait.png',
				overlayDialog : 'images/leather/LeatherPortrait.png',
				webView : 'images/leather/LeatherPortrait.png'
			},
			pillButton : 'images/leather/PillButton.png'
		}
	}
};

var style = {
	init : function () {
		Ti.Gesture.addEventListener("orientationchange", function styleOrientationChange(e) {
			style.dim.navBarHeight = (e.orientation == Ti.UI.LANDSCAPE_LEFT || e.orientation == Ti.UI.LANDSCAPE_RIGHT) ? 32 : 44;
		});		
	},
	set : function(id) {
		this.name = id;
		this.color = styles[id].color;
		this.fontFamily = styles[id].fontFamily;
		this.font = styles[id].font;
		this.dim = styles[id].dim;
		this.picker = styles[id].picker;
		this.image = styles[id].image;
		this.opacity = styles[id].opacity;
	}
};

style.init();
style.set(Ti.App.Properties.getString("style", "leather"));

module.exports = style;
