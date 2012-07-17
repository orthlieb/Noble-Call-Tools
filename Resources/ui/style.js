var _ = require('lib/underscore');
var log = require('lib/logger');

log.info('*** Device Attributes');
log.info('density: ' + Ti.Platform.displayCaps.density);
log.info('dpi: ' + Ti.Platform.displayCaps.dpi);
log.info('platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
log.info('platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
var osname = Ti.Platform.displayCaps.osname;
if (osname === 'android') {
    log.info('xdpi: ' + Ti.Platform.displayCaps.xdpi);
    log.info('ydpi: ' + Ti.Platform.displayCaps.ydpi);
    log.info('logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
}

var imageSuffix = '';
var density = Ti.Platform.displayCaps.density;
switch (density) {
    case 'high':
        if (osname !== 'iphone' && osname !== 'ipad') {
            imageSuffix = '@2x';
        }
        density = 2.0;
        break;
    case 'medium':
        density = 1;
        break;
    case 'low':
        density = 0.5;
        break;
    default:
        log.info('Unsupported density: ' + density);
        density = 1;
        break;
}

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
    gutter : {
        size : 10
    },
    pagingControl : {
        height : '30dp'
    },
    picker : {
        height : 215
    },
    textField : {
        height : (osname === 'android') ? 40 : 35,
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
        height : (osname === 'android') ? 40 : 35,
        selectedColor : '#e5af31' // Gold
    },
    translucentView : {
        opacity : 0.6
    },
    fontFamily : fontFamily,
    font : {
        tiny : {
            fontSize : 8 * density,
            fontFamily : fontFamily.sans
        },
        small : {
            fontSize : 10 * density,
            fontFamily : fontFamily.sans
        },
        medium : {
            fontSize : 14 * density,
            fontFamily : fontFamily.sans
        },
        large : {
            fontSize : 16 * density,
            fontFamily : fontFamily.sans
        },
        huge : {
            fontSize : 18 * density,
            fontFamily : fontFamily.sans
        }
    }
};

function StyleFindImage(/*string*/name) {
    // Finds the requested image, starting with the least specific to the most specific
    // file.orientation.osname.ext
    // That is, it searches for name.ext first, then name.orientation.ext, then name.orientation.osname.ext
    // Returns the file name
    var width = Ti.Platform.displayCaps.platformWidth;
    var height = Ti.Platform.displayCaps.platformHeight;
    var orientation = width > height ? 'landscape' : 'portrait';
    var file = name.split('.');

    log.info('Looking for named image: ' + Ti.Filesystem.resourcesDirectory + 'images/' + file[0] + imageSuffix + '.' + file[1]);
    var theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', file[0] + imageSuffix + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
    log.info('Looking for generated image: ' + Ti.Filesystem.resourcesDirectory + 'images/style/' + file[0] + imageSuffix + '.' + file[1]);
    theFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', 'style', file[0] + imageSuffix + '.' + file[1]);
    if (theFile.exists()) {
        return theFile.nativePath;
    }
    log.error('Could not find requested image: ' + name);
}

style.findImage = StyleFindImage;

_.bindAll(style);

module.exports = style;
