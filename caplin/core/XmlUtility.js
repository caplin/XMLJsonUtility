/**
 * This is a static class that never needs to be instantiated.
 * @constructor
 * 
 * @class
 * Utility class that provides methods for manipulating and interacting with XML.
 */
/*
Parts of this work are licensed under Creative Commons GNU LGPL License.
*/
caplin.core.XmlUtility = function(){};

/**
 * Converts a XML element into a JSON string.
 *
 * Useful for serializing JSON configurations in your layout. 
 * See {@link caplin.core.JsonUtility.toXml} for how to 
 * convert JSON back to XML.
 * 
 * @param {Object} oXml The XML object that will be converted.
 * @param {String} sTab Tab delimiter to use (defaults to an empty string)
 * 
 * @return {String} A JSON string.
 */
/*
This function is licensed under Creative Commons GNU LGPL License.
This function is based on the work by Stefan Goessner and has been
modified  by Caplin for purposes of avoiding having a global function.
Original code can be found here: http://goessner.net/download/prj/jsonxml/
Caplin's fork is here: https://github.com/caplin/XMLJsonUtility

License: http://creativecommons.org/licenses/LGPL/2.1/
Version: 0.9
Author: Stefan Goessner/2006, Caplin Systems Ltd/2013
Web: http://goessner.net/ http://www.caplin.com
*/
caplin.core.XmlUtility.toJson = function(oXml, sTab) {
	if (sTab == null) {
		sTab = '';
	}

	if (oXml.nodeType == 9) { // document node
		oXml = oXml.documentElement;
	}

	var json = caplin.core.XmlUtility._toJson(caplin.core.XmlUtility._toObj(caplin.core.XmlUtility._removeWhite(oXml)), oXml.nodeName, "\t");
	return "{" + sTab + (sTab ? json.replace(/\t/g, sTab) : json.replace(/\t|\n/g, "")) + "}";
};

/** @private */
caplin.core.XmlUtility._toObj = function(xml) {
	var o = {};
	if (xml.nodeType==1) { // element node ..
		if (xml.attributes.length) { // element with attributes  ..
			for (var i=0; i<xml.attributes.length; i++) {
				o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
			}
		}

		if (xml.firstChild) { // element has child nodes ..
			var textChild=0, cdataChild=0, hasElementChild=false;
			for (var n=xml.firstChild; n; n=n.nextSibling) {
				if (n.nodeType==1) {
					hasElementChild = true;
				} else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
					textChild++; // non-whitespace text
				} else if (n.nodeType==4) {
					cdataChild++; // cdata section node
				}
			}

			if (hasElementChild) {
				if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
					caplin.core.XmlUtility._removeWhite(xml);
					for (var n=xml.firstChild; n; n=n.nextSibling) {
						if (n.nodeType == 3) { // text node
							o["#text"] = caplin.core.XmlUtility._escapeXmlForJson(n.nodeValue);
						} else if (n.nodeType == 4) { // cdata node
							o["#cdata"] = caplin.core.XmlUtility._escapeXmlForJson(n.nodeValue);
						} else if (o[n.nodeName]) {  // multiple occurence of element ..
							if (o[n.nodeName] instanceof Array) {
								o[n.nodeName][o[n.nodeName].length] = caplin.core.XmlUtility._toObj(n);
							} else {
								o[n.nodeName] = [o[n.nodeName], caplin.core.XmlUtility._toObj(n)];
							}
						} else { // first occurence of element..
							o[n.nodeName] = caplin.core.XmlUtility._toObj(n);
						}
					}
				} else { // mixed content
					if (!xml.attributes.length) {
						o = caplin.core.XmlUtility._escapeXmlForJson(caplin.core.XmlUtility._innerXml(xml));
					} else {
						o["#text"] = caplin.core.XmlUtility._escapeXmlForJson(caplin.core.XmlUtility._innerXml(xml));
					}
				}
			} else if (textChild) { // pure text
				if (!xml.attributes.length) {
					o = caplin.core.XmlUtility._escapeXmlForJson(caplin.core.XmlUtility._innerXml(xml));
				} else {
					o["#text"] = caplin.core.XmlUtility._escapeXmlForJson(caplin.core.XmlUtility._innerXml(xml));
				}
			} else if (cdataChild) { // cdata
				if (cdataChild > 1) {
					o = caplin.core.XmlUtility._escapeXmlForJson(caplin.core.XmlUtility._innerXml(xml));
				} else {
					for (var n=xml.firstChild; n; n=n.nextSibling) {
						o["#cdata"] = caplin.core.XmlUtility._escapeXmlForJson(n.nodeValue);
					}
				}
			}
		}

		if (!xml.attributes.length && !xml.firstChild) {
			o = null;
		}
	} else if (xml.nodeType==9) { // document.node
		o = caplin.core.XmlUtility._toObj(xml.documentElement);
	} else {
		var errorMsg = 'caplin.core.XmlUtility.toJson() called with XML that can\'t be converted to JSON. Can\'t handle node type: ' + xml.nodeType;
		throw new caplin.core.Error(caplin.core.Error.INVALID_PARAMETERS, errorMsg);
	}

	return o;
};

/** @private */
caplin.core.XmlUtility._toJson = function(o, name, ind) {
	var json = name ? ("\""+name+"\"") : "";
	if (o instanceof Array) {
		for (var i=0,n=o.length; i<n; i++) {
			o[i] = caplin.core.XmlUtility._toJson(o[i], "", ind+"\t");
		}

		json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
	} else if (o == null) {
		json += (name&&":") + "null";
	} else if (typeof(o) == "object") {
		var arr = [];
		for (var m in o) {
			arr[arr.length] = caplin.core.XmlUtility._toJson(o[m], m, ind+"\t");
		}

		json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
	} else if (typeof(o) == "string") {
		json += (name&&":") + "\"" + o.toString() + "\"";
	} else {
		json += (name&&":") + o.toString();
	}

	return json;
};

/** @private */
caplin.core.XmlUtility._innerXml = function(node) {
	var s = "";
	if ("innerHTML" in node) {
		s = node.innerHTML;
	} else {
		var asXml = function(n) {
			var s = "";
			if (n.nodeType == 1) {
				s += "<" + n.nodeName;
				for (var i=0; i<n.attributes.length;i++) {
					s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
				}

				if (n.firstChild) {
					s += ">";
					for (var c=n.firstChild; c; c=c.nextSibling) {
						s += asXml(c);
					}
					s += "</"+n.nodeName+">";
				} else {
					s += "/>";
				}
			} else if (n.nodeType == 3) {
				s += n.nodeValue;
			} else if (n.nodeType == 4) {
				s += "<![CDATA[" + n.nodeValue + "]]>";
			}

			return s;
		};

		for (var c=node.firstChild; c; c=c.nextSibling) {
			s += asXml(c);
		}
	}
	return s;
};

/** @private */
caplin.core.XmlUtility._escapeXmlForJson = function(txt) {
	return txt.replace(/[\\]/g, "\\\\")
		.replace(/[\"]/g, '\\"')
		.replace(/[\n]/g, '\\n')
		.replace(/[\r]/g, '\\r');
};

/** @private */
caplin.core.XmlUtility._removeWhite = function(e) {
	e.normalize();
	for (var n = e.firstChild; n; ) {
		if (n.nodeType == 3) {  // text node
			if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
				var nxt = n.nextSibling;
				e.removeChild(n);
				n = nxt;
			} else {
				n = n.nextSibling;
			}
		} else if (n.nodeType == 1) { // element node
			caplin.core.XmlUtility._removeWhite(n);
			n = n.nextSibling;
		}
		else { // any other node
			n = n.nextSibling;
		}
	}

	return e;
};
