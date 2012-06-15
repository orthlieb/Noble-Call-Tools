exports.logLevel = 3;
    // Set to -1 to suppress all messages.
    // Set to 0 to log only errors.
    // Set to 1 to log warnings and errors
    // Set to 2 to log info, warnings, and errors
    // Set to 3 to log debug, info, warnings, and errors
    // Set to 0 for production, which will log only errors.
    
function getTime() {
    var date = new Date();
	return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

// function getName() {
	// var funcName = '';
    // if (arguments.callee.caller !== null) {
        // funcName = arguments.callee.caller.name;
        // if (funcName.length > 0){
            // funcName = '' + funcName + '()';
        // }
    // }
    // return funcName;	
// }

exports.start = function(message) {
	if (exports.logLevel >= 3) {
		var msg = getTime() + " " + arguments.callee.caller.name + '(';
		
		for (var i = 0; i < arguments.callee.caller.arguments.length; i++) {
			if (i != 0)
				msg += ", ";
			var arg = arguments.callee.caller.arguments[i];
			msg += (typeof(arg) == "function" ? "[function]" : arg);
		}
		
		msg += ') START ===> ' + (typeof(message) != "undefined" ? message : "");
		Ti.API.debug(msg);
	}
};

exports.debug = function(message) {
	if (exports.logLevel >= 3) {
		Ti.API.debug(getTime() + " " + arguments.callee.caller.name + ": " + message);
	}
};

exports.info = function(message) {
	if (exports.logLevel >= 2) {
    	Ti.API.info(getTime() + " " + arguments.callee.caller.name + ": " + message);
    }
};

exports.warn = function(message) {
	if (exports.logLevel >= 1) {
		Ti.API.warn(getTime() + " " + arguments.callee.caller.name + ": " + message);
	}
};

exports.error = function(message) {
	if (exports.logLevel >= 0) {
		Ti.API.error(getTime() + " " + arguments.callee.caller.name + ": " + message);
	}
};

function AssertException(message) { 
    this.message = message; 
}

AssertException.prototype.toString = function () {
    return "Assert Exception " + getTime() + " " + arguments.callee.caller.name + ": " + this.message;
};

exports.assert = function(exp, message) {
    if (!exp) {
        //throw new AssertException(message);
        Ti.API.error(getTime() + " " + arguments.callee.caller.name + ": " + message);
    }
}
