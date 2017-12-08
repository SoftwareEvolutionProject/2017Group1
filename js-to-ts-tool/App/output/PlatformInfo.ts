export class PlatformInfo  {
= (function() {
	var info = {
		browser:			'other', 
		version:			'n/a', 
		isTouchDevice:		(document.createTouch != undefined), 		// detect if it is running on touch device
		supportTypedArrays:	(window.Uint32Array != undefined),			// see if Typed Arrays are supported 
		supportWebGL:		(window.WebGLRenderingContext != undefined)	// see if WebGL context is supported
	};

	var agents = [
		['firefox', /Firefox[\/\s](\d+(?:\.\d+)*)/], 
		['chrome',  /Chrome[\/\s](\d+(?:\.\d+)*)/ ], 
		['opera',   /Opera[\/\s](\d+(?:\.\d+)*)/], 
		['safari',  /Safari[\/\s](\d+(?:\.\d+)*)/], 
		['webkit',  /AppleWebKit[\/\s](\d+(?:\.\d+)*)/], 
		['ie',      /MSIE[\/\s](\d+(?:\.\d+)*)/], 
		/*
		 * For IE11 and above, as the old keyword 'MSIE' no longer exists there.
		 * By Laurent Piroelle <laurent.piroelle@fabzat.com>.
		 */
		['ie',      /Trident\/\d+\.\d+;\s.*rv:(\d+(?:\.\d+)*)/]
	];

	var matches;
	for(var i=0; i<agents.length; i++) {
		if((matches = agents[i][1].exec(window.navigator.userAgent))) {
			info.browser = agents[i][0];
			info.version = matches[1];
			break;
		}
	}

	return info;
}) ();


/**
	@class BinaryStream
	The helper class to parse data from a binary stream.
 */
}
