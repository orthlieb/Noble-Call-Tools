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
		title : 'American Standard Version',
		copyright : "Public Domain",
		description : "The ASV has long been regarded by many scholars as the most literal English translation since the King James Version—maybe the most literal translation ever. This has made the translation very popular for careful English Bible study, but not for ease of reading. While the KJV was translated entirely from \"western manuscripts,\" the ASV 1901 was influenced also by the older \"eastern manuscripts\" that form the basis for most of our modern English translations. Because the ASV 1901 is very difficult to find in print, Logos is pleased to be able to preserve and distribute this significant work. This is an excellent choice for comparative English study.",
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'amp': {
		id: 'amp', // bibles.org
		title : 'Amplified Bible',
		copyright : 'All rights reserved. For Permission To Quote information visit http://www.lockman.org/',
		description : 'The Amplified Bible (AMP) is an English translation of the Bible produced jointly by The Zondervan Corporation and The Lockman Foundation. The first edition was published in 1965. It is largely a revision of the American Standard Version of 1901, with reference made to various texts in the original languages. It is designed to "amplify" the text by using a system of punctuation and other typographical features to bring out all shades of meaning present in the original texts.',
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'cev': {
		id: 'cev', // bibles.org
		title : 'Contemporary English Version',
		copyright : 'Copyright 2006, American Bible Society',
		description : 'The Contemporary English Version or CEV (also known as Bible for Today\'s Family) is a translation of the Bible into English, published by the American Bible Society.',
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'darby': {
		id: 'darby', // api.biblia.com
		title : '1890 Darby Bible',
		copyright : "Public Domain",
		description : "As an ex-Anglican minister and the founder of the Plymouth Brethren, Darby's influence started the Niagara Conferences, which were the beginnings of prophetically-oriented Bible conferences in America. First published in 1890, this translation comes after Darby's understanding of the original languages matured during the writing of his French and German translations of the Bible.",
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'emphbbl': {
		id: 'emphbbl', // api.biblia.com
		title : 'The Emphasized Bible',
		copyright : "Public Domain",
		description : "The Emphasized Bible, by Joseph Bryant Rotherham, is a unique translation which helps English-only Bible readers to understand the linguistic and literary nuances of the Greek and Hebrew texts. This translation aims for a literal rendering of the original languages, and adds markings to the English text to indicate emphases, parallel structures, and the other linguistic features. It also includes accent marks, brackets, indentations, and other markings within the text itself, to help communicate the features in Greek and Hebrew which are lost in translation.",
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'esv': {
		id: 'esv', // www.esvapi.org
		title : "English Standard Version",
		copyright : "Copyright 2001 by Crossway, a publishing ministry of Good News Publishers.",
		description : "The ESV Bible (English Standard Version) is an “essentially literal” translation of the Bible in contemporary English. The ESV Bible emphasizes “word-for-word” accuracy, literary excellence, and depth of meaning.",
		url: 'http://www.esvapi.org/v2/rest/passageQuery',
		options: esvOptions,
		stripper: esvStripper
	},
	'gnt': {
		id: 'gnt',	// bibles.org
		title : 'Good News Translation',
		copyright : 'Copyright 1992 by American Bible Society. Used by Permission.',
		description : 'The Good News Bible (GNB), also called the Good News Translation (GNT), is an English language translation of the Bible by the American Bible Society, first published as the New Testament under the name Good News for Modern Man in 1966.',
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'kjv': {
		id: 'kjv',	// api.biblia.com
		title : 'King James Version',
		copyright : "Public Domain",
		description : "Also known as the \"Authorized Version,\" The King James Version of the Bible is still the most widely used text in the English language. The Logos KJV includes the Strong's Numbers which allow English readers to identify and search for underlying Greek and Hebrew words in the original text.",
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
	'net': {
		id: 'net', // labs.bible.org
		title : 'The NET Bible',
		copyright : "Copyright 1996-2006 by Biblical Studies Press, L.L.C.",
		description : "The NET Bible is a completely new translation of the Bible with 60,932 translators’ notes! It was completed by more than 25 scholars – experts in the original biblical languages – who worked directly from the best currently available Hebrew, Aramaic, and Greek texts.",
		url: 'http://labs.bible.org/api/?',
		options: netOptions,
		stripper: netStripper
	},
	'nasb': {
		id: 'nasb',	// bibles.org
		title : 'New American Standard Bible',
		copyright : 'New American Standard Bible (NASB) Copyright 1960, 1962, 1963, 1968, 1971, 1972, 1973, 1975, 1977, 1995 by The Lockman Foundation, La Habra, CA. All rights reserved. Used by Permission.',
		description : 'The New American Standard Bible (NASB), also informally called the New American Standard Version (NASV), is an English translation of the Bible. The New Testament was first published in 1963. The complete Bible was published in 1971.',
		url: 'https://bibles.org/%version/passages.js?q[]=%verse',
		stripper: biblesOrgStripper,
		auth: 'uuzkgv7VOFPg03SgRw3JaKfWQh8C2kynUlO1XLMm:X'
	},
	'ylt': {
		id: 'ylt',	// api.biblia.com
		title : 'Young\'s Literal Translation',
		copyright : "Public Domain",
		description : "Robert Young is best known for his monumental work, Young's Analyte. Young's Literal Translation is a very good work to add to your Bible collection for text comparisons. Since this is a very literal translation, it offers a good contrast and comparison to a dynamic equivalent translatical Concordance To The Biblion like the NIV.",
		url: 'http://api.biblia.com/v1/bible/content/%version.txt.js',
		options: bibliaOptions,
		stripper: bibliaStripper
	},
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
	if (typeof(bibles[that.version].options) == 'function')
		options = bibles[that.version].options(that.version, that.verse);
	
	that.quote = L('loading');

	var xhr = Ti.Network.createHTTPClient({
		onload : function JSONOnLoad(e) {
			log.start("Quote JSON lookup callback");

			// this.responseText holds the raw text return of the message (used for JSON)
			// this.responseXML holds any returned XML (used for SOAP web services)
			// this.responseData holds any returned binary data
			var passage = this.responseText;
				
			if (typeof(bibles[that.version].stripper) == 'function')
				passage = bibles[that.version].stripper(passage);			

			// Strip duplicate whitespace.
			passage = passage.replace(/\s+/g, " ");
			// Strip white space at beginning and end.
			passage = passage.replace(/^\s+|\s+$/, "");

			log.debug("Quote JSON lookup succeeded: " + passage);
			if(passage != that.quote) {// Make sure it really has changed.
				that.quote = passage;
				cacheQuote(that.version, that.verse, that.quote);
				if( typeof (that.changeCallback) == "function")
					that.changeCallback({
						version : that.version,
						verse : that.verse,
						quote : that.quote
					});
				// Notify the owner that the quote has changed.
			}
		},
		onerror : function(e) {
			log.debug(e.error);
			that.quote = L("no_quote");
			if(typeof (that.errorCallback) == "function")
				that.errorCallback(e.error, e.status);
		},
		timeout : 10000
	});

	xhr.open("GET", url);
	if (typeof(bibles[that.version].auth) == 'string') {
		var authstr = 'Basic ' + Titanium.Utils.base64encode(bibles[that.version].auth);
		xhr.setRequestHeader('Authorization', authstr);
	}
	xhr.send(options);
};

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
			if(typeof (this.changeCallback) == "function")
				this.changeCallback({
					version : this.version,
					verse : this.verse,
					quote : this.quote
				});
		} else {
			loadQuote(this);
		}
	}

	return bChanged;
}

function lookupVersion(title) {
	for(var i in bibles) {
		if(bibles[i].title == title)
			return i;
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
