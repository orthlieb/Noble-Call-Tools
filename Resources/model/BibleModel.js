var log = require('helpers/logger');
var XMLTools = require('helpers/XMLTools');

// The bibles.org API returns a CDATA encapsulated string with superscripts and spans
function biblesOrgStripper(phrase) {
	phrase = JSON.parse(phrase);
	phrase = phrase.search[0].result.passages.passage_1.text_preview;	// Burrow through the object.

	// Strip CDATA stuff
	phrase = phrase.replace(/<!\[CDATA\[/g, "");
	phrase = phrase.replace(/\]\]>/g, "");
	// Strip the superscripts
	phrase = phrase.replace(/<sup .*?>.*?<\/sup>/g, "");
	// Strip the span information
	phrase = phrase.replace(/<\/*span.*?>/g, "");
	
	return phrase;
}

function bibliaOptions(version, verse) {
	return {
		"key" : '3559a4fd6f30ea12fec006e5a6c061f8',
		"passage" : verse
	};
}

function bibliaStripper(phrase) {
	phrase = JSON.parse(phrase);
	return phrase.text;
}

function esvOptions(version, verse) {
	return {
		"key" : "3b06c58d0d40201b",
		"passage" : verse,
		"output-format" : "plain-text",
		"include-passage-references" : false,
		"include-first-verse-numbers" : false,
		"include-verse-numbers" : false,
		"include-footnotes" : false,
		"include-copyright" : false,
		"include-passage-horizontal-lines" : false,
		"include-heading-horizontal-lines" : false,
		"include-headings" : false,
		"include-subheadings" : false,
		"include-selahs" : false,
		"line-length" : 0
	};
}

function netOptions(version, verse) {
	return {
		"passage" : verse,
		"formatting" : "plain",
		"type" : "text"
	};
}

function netStripper(phrase) {
	// Net bible has some wacky chapter/verse bolded thing on the front.
	return phrase.replace(/^\s?<.*>.*<.*>\s/, "");
}

function esvStripper(phrase) {
	// ESV bible has a bug at the end.
	return phrase.replace(/\s?\(ESV\)\s?$/, "");
}

var bibles = {
	'asv': {
		id: 'asv',	// api.biblia.com
		title : L('asv_name'),
		copyright : L('asv_copyright'),
		description : L('asv_desc'),
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'amp': {
		id: 'amp', // bibles.org
		title : L('amp_name'),
		copyright : L('amp_copyright'),
		description : L('amp_desc'),
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'cev': {
		id: 'cev', // bibles.org
		title : L('cev_name'),
		copyright : L('cev_copyright'),
		description : L('cev_desc'),
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'darby': {
		id: 'darby', // api.biblia.com
		title : L('darby_name'),
		copyright : L('darby_copyright'),
		description : L('darby_desc'),
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'emphbbl': {
		id: 'emphbbl', // api.biblia.com
		title : L('emphbbl_name'),
		copyright : L('emphbbl_copyright'),
		description : L('emphbbl_desc'),
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'esv': {
		id: 'esv', // www.esvapi.org
		title : L('esv_name'),
		copyright : L('esv_copyright'),
		description : L('esv_desc'),
		url: 'http://www.esvapi.org/v2/rest/passageQuery',
		options: esvOptions,
		stripper: esvStripper
	},
	'gnt': {
		id: 'gnt',	// bibles.org
		title : L('gnt_name'),
		copyright : L('gnt_copyright'),
		description : L('gnt_desc'),
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'kjv': {
		id: 'kjv',	// api.biblia.com
		title : L('kjv_name'),
		copyright : L('kjv_copyright'),
		description : L('kjv_desc'),
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'net': {
		id: 'net', // labs.bible.org
		title : L('net_name'),
		copyright : L('net_copyright'),
		description : L('net_desc'),
		url: 'http://labs.bible.org/api/?',
		options: netOptions,
		stripper: netStripper
	},
	'nasb': {
		id: 'nasb',	// bibles.org
		title : L('nasb_name'),
		copyright : L('nasb_copyright'),
		description : L('nasb_desc'),
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'ylt': {
		id: 'ylt',	// api.biblia.com
		title : L('ylt_name'),
		copyright : L('ylt_copyright'),
		description : L('ylt_desc'),
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	}
};

function findQuote(version, verse) {
	// Look for the quote in the cache.
	var key = '[' + version + '] ' + verse;
	var passage = Ti.App.Properties.getString(key);
	
	return passage;
}

function cacheQuote(version, verse, quote) {
	// Cache the quote
	var key = '[' + version + '] ' + verse;
	Ti.App.Properties.setString(key, quote);
}

// Makes the async call to load the quote.
function loadQuote(that) {
	log.start("version=" + that.version + " verse=" + that.verse);

	var url = bibles[that.version].url;
	url = url.replace(/%version/, that.version.toUpperCase());
	url = url.replace(/%verse/, escape(that.verse));
	
	var options = {};
	if (typeof(bibles[that.version].options) == 'function') {
		options = bibles[that.version].options(that.version, that.verse);
	}
	
	that.quote = L('loading');

	var xhr = Ti.Network.createHTTPClient({
		onload : function JSONOnLoad(e) {
			log.start("Quote JSON lookup callback");

			// this.responseText holds the raw text return of the message (used for JSON)
			// this.responseXML holds any returned XML (used for SOAP web services)
			// this.responseData holds any returned binary data
			var passage = this.responseText;
				
			if (typeof(bibles[that.version].stripper) == 'function') {
				passage = bibles[that.version].stripper(passage);			
            }
            
			// Strip duplicate whitespace.
			passage = passage.replace(/\s+/g, " ");
			// Strip white space at beginning and end.
			passage = passage.replace(/^\s+|\s+$/, "");

			log.debug("Quote JSON lookup succeeded: " + passage);
			if(passage != that.quote) {// Make sure it really has changed.
				that.quote = passage;
				cacheQuote(that.version, that.verse, that.quote);
				if( typeof (that.changeCallback) == "function") {
                   // Notify the owner that the quote has changed.
					that.changeCallback({
						version : that.version,
						verse : that.verse,
						quote : that.quote
					});
				}
			}
		},
		onerror : function(e) {
			log.debug(e.error);
			that.quote = L("no_quote");
			if(typeof (that.errorCallback) == "function") {
				that.errorCallback(e.error, e.status);
			}
		},
		timeout : 10000
	});

	xhr.open("GET", url);
	if (typeof(bibles[that.version].auth) == 'string') {
		var authstr = 'Basic ' + Titanium.Utils.base64encode(bibles[that.version].auth);
		xhr.setRequestHeader('Authorization', authstr);
	}
	xhr.send(options);
}

function validVersion(vn) {
	return ( typeof (vn) == "string" && typeof (bibles[vn]) == "object");
}

function validVerse(vs) {
	return ( typeof (vs) == "string");
}

// Sets the version and verse simultaneously for the quote. Forces a lookup if something has changed.
function setVersionVerse(/*String*/vn, /*String*/vs) {
	var bChanged = false;

	if(validVersion(vn) && this.version != vn) {
		this.version = vn;
		bChanged = true;
	}
	if(validVerse(vs) && this.verse != vs) {
		this.verse = vs;
		bChanged = true;
	}
	if(bChanged) {
		this.quote = findQuote(this.version, this.verse);
		if (typeof(this.quote) == "string") { // Found in cache.
			if(typeof (this.changeCallback) == "function") {
				this.changeCallback({
					version : this.version,
					verse : this.verse,
					quote : this.quote
				});
			}
		} else {
			loadQuote(this);
		}
	}

	return bChanged;
}

function lookupVersion(title) {
	for(var i in bibles) {
		if(bibles[i].title == title) {
			return i;
		}
	}

	return 'unknown';
}

// BibleQuote Model can be used to retrieve quotes from various bible services.
function BibleModel(/*string*/vn, /*string*/vs, /*function*/change, /*function*/error) {
	log.start();

	this.changeCallback = change;
	this.errorCallback = error;

	this.setVersionVerse(vn, vs);
	// Loads up the quote as well.
}

// External interface.
BibleModel.prototype.bibles = bibles;
BibleModel.prototype.setVersionVerse = setVersionVerse;
BibleModel.prototype.lookupVersion = lookupVersion;

module.exports = BibleModel;
