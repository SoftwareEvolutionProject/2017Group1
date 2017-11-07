/**
	@class Material

	This class implements material which describes the feel and look of a mesh.
 */
export class Material {
    name = '';
    diffuseColor = 0x7f7f7f;
    ambientColor = 0;
    transparency = 0;
    simulateSpecular = false;
    palette = null;

    constructor(name, ambientColor, diffuseColor, transparency, simulateSpecular) {
        this.name = name || '';
        this.diffuseColor = diffuseColor || 0x7f7f7f;
        // default ambient color will be of 1/8 the intensity of the diffuse color
        this.ambientColor = (typeof ambientColor) == 'number' ? ambientColor : (((this.diffuseColor & 0xff0000) >> 3) & 0xff0000 | ((this.diffuseColor & 0xff00) >> 3) & 0xff00 | ((this.diffuseColor & 0xff) >> 3));
        this.transparency = transparency || 0;
        this.simulateSpecular = simulateSpecular || false;
        this.palette = null;
    }

    /**
        Get the palette of the material used for shadings.
        @return {Array} palette of the material as an array.
    */
    getPalette() {
        if (!this.palette) {
            this.palette = new Array(256);
            this.generatePalette();
        }

        return this.palette;
    }

    /**
        @private
    */
    generatePalette() {
        let ambientR = (this.ambientColor & 0xff0000) >> 16;
        let ambientG = (this.ambientColor & 0xff00) >> 8;
        let ambientB = this.ambientColor & 0xff;
        let diffuseR = (this.diffuseColor & 0xff0000) >> 16;
        let diffuseG = (this.diffuseColor & 0xff00) >> 8;
        let diffuseB = this.diffuseColor & 0xff;

        if (this.simulateSpecular) {
            let i = 0;
            while (i < 204) {
                let r = Math.max(ambientR, i * diffuseR / 204);
                let g = Math.max(ambientG, i * diffuseG / 204);
                let b = Math.max(ambientB, i * diffuseB / 204);
                if (r > 255) {
                    r = 255;
                }
                if (g > 255) {
                    g = 255;
                }
                if (b > 255) {
                    b = 255;
                }

                this.palette[i++] = r << 16 | g << 8 | b;
            }

            // simulate specular high light
            while (i < 256) {
                let r = Math.max(ambientR, diffuseR + (i - 204) * (255 - diffuseR) / 82);
                let g = Math.max(ambientG, diffuseG + (i - 204) * (255 - diffuseG) / 82);
                let b = Math.max(ambientB, diffuseB + (i - 204) * (255 - diffuseB) / 82);
                if (r > 255) {
                    r = 255;
                }
                if (g > 255) {
                    g = 255;
                }
                if (b > 255) {
                    b = 255;
                }

                this.palette[i++] = r << 16 | g << 8 | b;
            }
        } else {
            let i = 0;
            while (i < 256) {
                let r = Math.max(ambientR, i * diffuseR / 256);
                let g = Math.max(ambientG, i * diffuseG / 256);
                let b = Math.max(ambientB, i * diffuseB / 256);
                if (r > 255) {
                    r = 255;
                }
                if (g > 255) {
                    g = 255;
                }
                if (b > 255) {
                    b = 255;
                }

                this.palette[i++] = r << 16 | g << 8 | b;
            }
        }
    }
}
