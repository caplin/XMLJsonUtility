/**
 * This is a static class that never needs to be instantiated.
 * 
 * @static
 * @class
 *
 * Utility class that provides methods for manipulating and interacting with JSON.
 * 
 * @constructor
 */
/*
Parts of this work are licensed under Creative Commons GNU LGPL License.
*/
caplin.core.JsonUtility = function() {};

/**
 * Converts a object literal into it's XML representation, that can 
 * be later converted back to JSON with {@link caplin.core.XmlUtility.toJson}.
 * 
 * @param {Object} oObject The object literal you want to convert.
 * @param {String} sTab Tab delimiter to use (defaults to an empty string)
 * 
 * @return {String} XML representation of the passed object literal.
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
caplin.core.JsonUtility.toXml = function(oObject, sTab) {
	if (sTab == null) {
		sTab = '';
	}

	var xml = '';

	for (var m in oObject) {
		xml += caplin.core.JsonUtility._toXml(oObject[m], m, '');
	}

	return sTab ? xml.replace(/\t/g, sTab) : xml.replace(/\t|\n/g, '');
};

/** @private */
caplin.core.JsonUtility._toXml = function(v, name, ind) {
	var xml = "";

	if (v instanceof Array) {
		for (var i=0, n=v.length; i<n; i++) {
			xml += ind + caplin.core.JsonUtility._toXml(v[i], name, ind+"\t") + "\n";
		}
	} else if (typeof(v) == "object") {
		var hasChild = false;
		xml += ind + "<" + name;
		for (var m in v) {
			if (m.charAt(0) == "@") {
				xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
			} else {
				hasChild = true;
			}
		}

		xml += hasChild ? ">" : "/>";
		if (hasChild) {
			for (var m in v) {
				if (m == "#text") {
					xml += v[m];
				} else if (m == "#cdata") {
					xml += "<![CDATA[" + v[m] + "]]>";
				} else if (m.charAt(0) != "@") {
					xml += caplin.core.JsonUtility._toXml(v[m], m, ind+"\t");
				}
			}

			xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
		}
	} else {
		xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
	}

	return xml;
};
