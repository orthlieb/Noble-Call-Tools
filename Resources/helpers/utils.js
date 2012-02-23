// Note this is NOT recursive and obj2 will overwrite existing values in obj1 that have the same key.
exports.merge = function ObjectMerge(obj1, obj2) {
	for (var i in obj2) {
		if (!obj1.hasOwnProperty(i)) {
			obj1[i] = obj2[i];
		}
	}
	
	return obj1;
};

var resource_locations;

if (Ti.Platform.osname == 'android') {
	resource_locations = {
		'image': '/images/',
		'html': '/HTML/'
	};
} else {
	resource_locations = {
		'image': '/images/',
		'html': '/HTML/'
	};
}

exports.resourceDir = function GetResourceDir(/*string*/type) {
		return resource_locations[type];
}
