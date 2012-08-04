var _ = require('lib/underscore');
var log = require('lib/logger');

log.info('*** Device Attributes');
log.info('density: ' + Ti.Platform.displayCaps.density);
log.info('dpi: ' + Ti.Platform.displayCaps.dpi);
log.info('platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
log.info('platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
var osname = Ti.Platform.osname;
if (osname === 'android') {
    log.info('xdpi: ' + Ti.Platform.displayCaps.xdpi);
    log.info('ydpi: ' + Ti.Platform.displayCaps.ydpi);
    log.info('logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
}

// Calculate whether we're dealing with a "short" device on Android.
var screenRatio = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.platformWidth;
var isShort = (screenRatio == 3/4 || screenRatio == 4/3);

// Calculate the scaling factor
var scaleFactor = 1;

// Based on density
var scales = {  
    'xhigh' : 2,
    'high': 1.5,
    'medium' : 1,
    'low' : 0.75
}
if (osname == 'android')
    scaleFactor = scales[Ti.Platform.displayCaps.density];
    
// Based on phone/tablet
var screenSizeInPixels = Math.sqrt(
    Math.pow(Ti.Platform.displayCaps.platformWidth, 2) +
    Math.pow(Ti.Platform.displayCaps.platformHeight, 2)
);
var screenSizeInInches = screenSizeInPixels / Ti.Platform.displayCaps.dpi;   
scaleFactor *= (osname === 'ipad'|| (osname === 'android' && screenSizeInInches > 6)) ? 2 : 1;

var fontFamily = {};
switch (osname) {
    case 'iphone':
    case 'ipad':
        fontFamily.serif = 'Georgia';
        fontFamily.sans = 'Calibri';
        break;
    case 'android':
        fontFamily.serif = 'serif';
        fontFamily.sans = 'sans-serif';
        break;
    case 'mobileweb':
        fontFamily.serif = 'Georgia';
        fontFamily.sans = 'Calibri';
        break;
    default:
        log.assert(false, "Cross Platform code not implemented.");
        break;
}

var style = {
    buttonGrid: {
        width: 85 * scaleFactor,
        height: 122 * scaleFactor  
    },
    gutter : {
        size : 10 * scaleFactor
    },
    pagingControl : {
        height : 30 * scaleFactor
    },
    picker : {
        height : 215
    },
    textField : {
        height : 35 * scaleFactor,
        color : 'black'
    },
    win : {
        barColor : '#515151', // Putty
        backgroundColor : '#D1D1D1' // Light gray
    },
    label : {
        color : '#fff' // White
    },
    button : {
        height : 35 * scaleFactor,
        selectedColor : '#e5af31' // Gold
    },
    comboBox : {
        height: (osname == 'android' ? 40 : 35) * scaleFactor,  
    },
    translucentView : {
        opacity : 0.6
    },
    fontFamily : fontFamily,
    font : {
        tiny : {
            fontSize : 8 * scaleFactor,
            fontFamily : fontFamily.sans
        },
        small : {
            fontSize : 10 * scaleFactor,
            fontFamily : fontFamily.sans
        },
        medium : {
            fontSize : 14 * scaleFactor,
            fontFamily : fontFamily.sans
        },
        large : {
//            fontSize : 16 * scaleFactor,
           fontFamily : fontFamily.sans
        },
        huge : {
            fontSize : 18 * scaleFactor,
            fontFamily : fontFamily.sans
        }
    }
};

function StyleFindImage(/*string*/name) {
    // Finds the requested image, images are considered to be form factor and orientation neutral.
    // Returns the modified file name
   
    return '/images/' + name;
}

style.findImage = StyleFindImage;

function StyleFindBackground(/*string*/name) {
    // Finds the requested image, form factor and orientation add suffixes as appropriate.
    var isTablet = (screenSizeInInches > 6);
    var isLandscape = Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT;

    name = name.split('.');
    var ext = name.pop();
    name.push(isLandscape ? 'Landscape' : 'Portrait');
    if (osname == 'iphone' || osname == 'ipad') {
        name.push(isTablet ? 'Tablet' : 'Phone');
    }
    name = name.join('-') + (isShort ? '-Short' : '') + '.' + ext;

    log.info('Find background in /images/' + name);
    return '/images/' + name;
}

style.findBackground = StyleFindBackground;

_.bindAll(style);

module.exports = style;
