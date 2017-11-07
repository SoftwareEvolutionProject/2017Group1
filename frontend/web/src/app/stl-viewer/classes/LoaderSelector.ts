/**
	@class LoaderSelector
 */
export class LoaderSelector {
    loaderTable = {};

    /**
        Register a scene loader for a specific file format, using the file extesion name for lookup.
        @param {String} fileExtName extension name for the specific file format.
        @param {Function} loaderCtor constructor of the loader class.
        */
    registerLoader(fileExtName, loaderCtor) {
        if ((typeof loaderCtor) == 'function') {
            this.loaderTable[fileExtName] = loaderCtor;
        }
    }

    /**
        Get the proper loader for a target file format using the file extension name.
        @param {String} fileExtName file extension name for the specific format.
        @returns {Object} loader object for the specific format; null if not found.
        */
    getLoader(fileExtName) {
        let loaderCtor = this.loaderTable[fileExtName.toLowerCase()];
        if (!loaderCtor) {
            return null;
        }

        let loaderInst;
        try {
            loaderInst = new loaderCtor();
        } catch (e) {
            loaderInst = null;
        }

        return loaderInst;
    }
}

