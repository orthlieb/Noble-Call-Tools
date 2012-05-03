var _ = require('helpers/underscore');
var log = require('helpers/logger');

// Styles
if (Ti.Platform.osname == 'android') {
	var fontFamily = {
		serif : 'serif',
		sans : 'sans-serif'
	};
} else {
	var fontFamily = {
		serif : 'Georgia',
		sans : 'Calibri'
	};
}

var styles = {
	linen : {
	    name : L('style_linen'),
	    win: {
            barColor: '#807759', // Putty	        
            backgroundColor: '#f1e9cf' // Light tan           
	    },
        label: {
            color : '#fff' // White      
        },
        button: {
            selectedColor: '#e5af31' // Gold
        },
        translucentView: {
            opacity: 0.1    
        },

		fontFamily: fontFamily,
		font : {
			tiny : {
				fontSize : 8,
				fontFamily : fontFamily.serif
			},
			small : {
				fontSize : 10,
				fontFamily : fontFamily.serif
			},
			medium : {
				fontSize : 14,
				fontFamily : fontFamily.serif
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			large : {
				fontSize : 16,
				fontFamily : fontFamily.serif
			}, //shadowColor:'black', shadowOffset:{x:0,y:1}
			huge : {
				fontSize : 18,
				fontFamily : fontFamily.serif
			} //shadowColor:'black', shadowOffset:{x:0,y:1}
		}
    },
	leather : {
	    name : L('style_leather'),
        win: {
            barColor: '#515151',        // Putty
            backgroundColor: '#D1D1D1' // Light gray            
        },
        label: {
            color : '#fff' // White      
        },
        button: {
            selectedColor: '#e5af31' // Gold
        },
        translucentView: {
            opacity: 0.4    
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
		}
	}
};

function StyleSet(id) {
    for (var i in styles[id]) {
        if (styles[id].hasOwnProperty(i)) {
            this[i] = styles[id][i];
        }
    }
    
    this.style = id;
    Ti.App.Properties.setString('style', id);
}

function StyleLookup(/*TiUIString*/name) {
    // Maps a style name to a style id
    for(var i in styles) {
        if(styles[i].name == name) {
            return i;
        }
    }
    return 'unknown';    
}

function StyleFindImage(/*string*/name) {
    // Finds the requested image, starting with the least specific to the most specific
    // file.orientation.osname.ext
    // That is, it searches for name.ext first, then name.orientation.ext, then name.orientation.osname.ext
    // Returns the file name
    var width = Ti.Platform.displayCaps.platformWidth;
    var height = Ti.Platform.displayCaps.platformHeight;
    var orientation = width > height ? 'landscape' : 'portrait';
    var osname = Ti.Platform.osname;
    var file = name.split('.');

    log.info('Looking for ' + Ti.Filesystem.resourcesDirectory + 'images/' + file[0] + '.' + file[1]);
    var theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', file[0] + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
    log.info('Looking for ' + Ti.Filesystem.resourcesDirectory + 'images/' + this.style + '/' + file[0] + '.' + file[1]);
    theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', this.style, file[0] + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
    log.info('Looking for ' + Ti.Filesystem.resourcesDirectory + 'images/' + this.style + '/' + file[0] + '.' + orientation + '.' + file[1]);
    theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', this.style, file[0] + '.' + orientation + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
    
    log.info('Looking for ' + Ti.Filesystem.resourcesDirectory + 'images/' + this.style + '/' + file[0] + '.' + orientation + '.' + osname + '.' + file[1]);
    theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', this.style, file[0] + '.' + orientation + '.' + osname + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
}

var style = {
    set: StyleSet,
    findImage: StyleFindImage,
    lookup: StyleLookup,
	styles: styles
};
_.bindAll(style);

style.set("leather");//Ti.App.Properties.getString("style", "linen"));

module.exports = style;
