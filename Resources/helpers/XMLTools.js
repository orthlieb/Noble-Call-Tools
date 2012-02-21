/*globals exports*/

// In the style of http://www.thomasfrank.se/xml_to_json.html but for Appcelerator with extras. 

var doc, obj;

function XMLTools(xml_string) {
	doc = Ti.XML.parseString(xml_string).documentElement;
};

function getDocument() {
	return doc;
};

function addToObject(obj, key, value) {
	if (obj[key] == null) {
		obj[key] = value;
	} else if (!(obj[key] instanceof Array)) {
		var tmp = obj[key];
		var arr = [tmp, value];
		obj[key] = arr;
	} else {
		obj[key].push(value);
	}
	return obj;
};

function traverseTree(node) {
	var textOnly = true;
	var part = {};
	if (node.hasChildNodes()) {
		for (var ch_index = 0; ch_index < node.childNodes.length; ch_index++) {
			var ch = node.childNodes.item(ch_index);
			if (ch.nodeType == 3 || ch.nodeType == 4) {	//Text Node or CDATA node
				return ch.text;
			} else {
				part = addToObject(part, ch.tagName, traverseTree(ch));
			}
		}
		textOnly = false;
	}
	if(node.hasAttributes()) {
		for(var att_index = 0; att_index < node.attributes.length; att_index++) {
			var att = node.attributes.item(att_index);
			//part = addToObject(part, att.nodeName, att.nodeValue);
			part[att.nodeName] = att.nodeValue;
		}
		textOnly = false;
	}
	return part;
};

function toObject() {
	obj = traverseTree(doc);
	return obj;
};

function toJSON() {
	if(obj == null) {
		obj = traverseTree(doc);
	}
	return obj;
};

XMLTools.prototype.getDocument = getDocument;
XMLTools.prototype.toObject = toObject;
XMLTools.prototype.toJSON = toJSON;
module.exports = XMLTools;