// TODO: Lot of crap to do here

export class PlatformInfo {
	
    browser: string =	'other';
    version: string =	'n/a';
    isTouchDevice: boolean = false; //(document.createTouch != undefined); 		// detect if it is running on touch device
    supportTypedArrays:	boolean = false; //(window.Uint32Array != undefined);			// see if Typed Arrays are supported
    supportWebGL: boolean =	true; //(window.WebGLRenderingContext != undefined);	// see if WebGL context is supported


	agents = [
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


    constructor() {
        /*var matches = null;
        for(var i=0; i<this.agents.length; i++) {
            if((matches = this.agents[i][1].exec(window.navigator.userAgent))) {
                this.browser = this.agents[i][0].toString();
                this.info.version = matches[1];
                break;
            }
        }*/
        
    }
}
