export class LoaderSelector  {
= {

	/**
		Register a scene loader for a specific file format, using the file extesion name for lookup.
		@param {String} fileExtName extension name for the specific file format.
		@param {Function} loaderCtor constructor of the loader class.
	 */
	registerLoader: function(fileExtName, loaderCtor) {
		if((typeof loaderCtor) == 'function') {
			oaderTable[fileExtName] = loaderCtor;
		}
	},

	/**
		Get the proper loader for a target file format using the file extension name.
		@param {String} fileExtName file extension name for the specific format.
		@returns {Object} loader object for the specific format; null if not found.
	 */
	getLoader: function(fileExtName) {
		var loaderCtor = .toLowerCase()];
		if(!loaderCtor)
			return null;

		var loaderInst;
		try {
			loaderInst = new loaderCtor();
		}
		catch(e) {
			loaderInst = null; 
		}

		return loaderInst;
	},

	loaderTable: {}
};


/**
	@class ObjLoader

	This class implements a scene loader from a Wavefront obj file. 
 */
}
