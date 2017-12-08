export class Util  {
= {

	/**
	 * Convert content of a responseBody, as the result of an XHR request, to a (binary) string. 
	 * This method is special for IE.
	 */
	ieXHRResponseBodyToString: function(responseBody) {
		// I had expected this could be done by a single line: 
		//     String.fromCharCode.apply(null, (new VBArray(responseBody)).toArray()); 
		// But it tends to result in an 'out of stack space' exception on larger streams. 
		// So we just cut the array to smaller pieces (64k for each) and convert them to 
		// strings which can then be combined into one.
		var arr = (new VBArray(responseBody)).toArray();
		var str = '';
		for(var i=0; i<arr.length-65536; i+=65536)
			str += String.fromCharCode.apply(null, arr.slice(i, i+65536));
		return str + String.fromCharCode.apply(null, arr.slice(i));
	}

};


}
