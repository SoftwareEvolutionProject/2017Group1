/**
    @class Texture

    This class implements texture which describes the surface details for a mesh.
*/
export class Texture {

    name = '';
    data = null;
    mipmaps = null;
    mipentries = null;
    /**
     * {Number} Width of the texture in pixels. Read only.
     */
    width = 0;
    /**
     * {Number} Height of the texture in pixels. Read only.
     */
    height = 0;
    /**
     * {Boolean} Whether the texture contains tranparent pixels. Read only.
     */
    hasTransparency = false;
    /**
     * {String} URL of the image source of the texture. Read only.
     */
    srcUrl = '';
    /**
     * {Function} A callback function that will be invoked immediately as the texture is ready.
     */
    onready = null;
    cv = null;

    constructor(name, onready) {
        this.name = name || '';
        this.width = 0;
        this.height = 0;
        this.data = null;
        this.mipmaps = null;
        this.mipentries = null;
        this.hasTransparency = false;
        this.srcUrl = '';
        this.onready = (onready && typeof(onready) == 'function') ? onready : null;
    }

    /**
        Load an image and extract texture data from it.
        @param {String} imageUrl where to load the image.
        @param {Boolean} useMipmap set true to generate mip-maps; false(default) not to generate mip-maps.
    */
    createFromUrl(imageUrl, useMipmap) {
        let self = this;
        let img = new Image;

        img.onload = function() {
            self.data = null;
            self.mipmaps = null;
            self.mipentries = null;
            self.width = 0;
            self.height = 0;
            self.hasTransparency = false;
            self.srcUrl = '';
            self.createFromImage(this, useMipmap);
        };

        img.onerror = function() {
            self.data = null;
            self.mipmaps = null;
            self.mipentries = null;
            self.width = 0;
            self.height = 0;
            self.hasTransparency = false;
            self.srcUrl = '';
        };

        img.crossOrigin = 'anonymous'; // explicitly enable cross-domain image
        img.src = encodeURI(imageUrl);
    }

    /**
        Extract texture data from an exsisting image.
        @param {Image} image image as datasource of the texture.
        @param {Boolean} useMipmap set true to generate mip-maps; false(default) not to generate mip-maps.
    */
    createFromImage(image, useMipmap) {
        if (image.width <= 0 || image.height <= 0) {
            return;
        }

        let isCanvasClean = false;
        let canvas = this.cv;
        if (!canvas) {
            try {
                canvas = document.createElement('canvas');
                this.cv = canvas;
                isCanvasClean = true;
            } catch (e) {
                return;
            }
        }

        // look for appropriate texture dimensions
        let dim = image.width > image.height ? image.width : image.height;
        if (dim <= 16) {
            dim = 16;
        } else if (dim <= 32) {
            dim = 32;
             } else if (dim <= 64) {
            dim = 64;
             } else if (dim <= 128) {
            dim = 128;
             } else if (dim <= 256) {
            dim = 256;
             } else if (dim <= 512) {
            dim = 512;
             } else {
            dim = 1024;
             }

        if (canvas.width != dim || canvas.height != dim) {
            canvas.width = canvas.height = dim;
            isCanvasClean = true;
        }

        let data;
        try {
            let ctx = canvas.getContext('2d');
            if (!isCanvasClean) {
                ctx.clearRect(0, 0, dim, dim);
            }
            ctx.drawImage(image, 0, 0, dim, dim);
            let imgData = ctx.getImageData(0, 0, dim, dim);
            data = imgData.data;
        } catch (e) {
            return;
        }

        let size = data.length / 4;
        this.data = new Array(size);
        let alpha;
        for (let i = 0, j = 0; i < size; i++, j += 4) {
            alpha = data[j + 3];
            this.data[i] = alpha << 24 | data[j] << 16 | data[j + 1] << 8 | data[j + 2];
            if (alpha < 255) {
                this.hasTransparency = true;
            }
        }

        this.width = dim;
        this.height = dim;

        this.mipmaps = null;
        if (useMipmap) {
            this.generateMipmaps();
        }

        this.srcUrl = image.src;

        if (this.onready != null && (typeof this.onready) == 'function') {
            this.onready();
        }
    }

    /**
        See if this texture contains texel data.
        @returns {Boolean} true if it has texel data; false if not.
    */
    hasData() {
        return (this.data != null);
    }

    /**
        Generate mip-map pyramid for the texture.
    */
    generateMipmaps() {
        if (this.width <= 1 || this.data == null || this.mipmaps != null) {
            return;
        }

        this.mipmaps = [this.data];
        this.mipentries = [1];

        let numOfMipLevels = 1 + ~~(0.1 + Math.log(this.width) * Math.LOG2E);
        let dim = this.width >> 1;
        for (let level = 1; level < numOfMipLevels; level++) {
            let map = new Array(dim * dim);
            let uppermap = this.mipmaps[level - 1];
            let upperdim = dim << 1;

            let src = 0, dest = 0;
            for (let i = 0; i < dim; i++) {
                for (let j = 0; j < dim; j++) {
                    let texel0 = uppermap[src];
                    let texel1 = uppermap[src + 1];
                    let texel2 = uppermap[src + upperdim];
                    let texel3 = uppermap[src + upperdim + 1];
                    let a = ( ((texel0 & 0xff000000) >>> 2) + ((texel1 & 0xff000000) >>> 2) + ((texel2 & 0xff000000) >>> 2) + ((texel3 & 0xff000000) >>> 2) ) & 0xff000000;
                    let r = ( ((texel0 & 0xff0000) + (texel1 & 0xff0000) + (texel2 & 0xff0000) + (texel3 & 0xff0000)) >> 2 ) & 0xff0000;
                    let g = ( ((texel0 & 0xff00) + (texel1 & 0xff00) + (texel2 & 0xff00) + (texel3 & 0xff00)) >> 2 ) & 0xff00;
                    let b = ( ((texel0 & 0xff) + (texel1 & 0xff) + (texel2 & 0xff) + (texel3 & 0xff)) >> 2 ) & 0xff;
                    map[dest] = a + r + g + b;
                    src += 2;
                    dest++;
                }
                src += upperdim;
            }

            this.mipmaps.push(map);
            this.mipentries.push(Math.pow(4, level));
            dim = dim >> 1;
        }
    }

    /**
        See if this texture has mip-maps.
        @returns {Boolean} true if it has mip-maps; false if not.
    */
    hasMipmap = function() {
        return (this.mipmaps != null);
    };
}
