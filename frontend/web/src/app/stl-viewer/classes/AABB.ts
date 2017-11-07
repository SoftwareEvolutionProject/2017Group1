/**
	@class AABB

	This class implements the Axis-Aligned Bounding Box to measure spatial enclosure.
 */
export class AABB {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;

    constructor() {
        /**
         * {Number} X coordinate of the minimum edge of the box.
         */
        this.minX = 0;
        /**
         * {Number} Y coordinate of the minimum edge of the box.
         */
        this.minY = 0;
        /**
         * {Number} Z coordinate of the minimum edge of the box.
         */
        this.minZ = 0;
        /**
         * {Number} X coordinate of the maximum edge of the box.
         */
        this.maxX = 0;
        /**
         * {Number} Y coordinate of the maximum edge of the box.
         */
        this.maxY = 0;
        /**
         * {Number} Z coordinate of the maximum edge of the box.
         */
        this.maxZ = 0;
    }

    /**
        Get center coordinates of the AABB.
        @param {Array} c an array to receive the result.
        @returns {Array} center coordinates as an array.
    */
    center(c) {
        if (c) {
            c[0] = 0.5 * (this.minX + this.maxX);
            c[1] = 0.5 * (this.minY + this.maxY);
            c[2] = 0.5 * (this.minZ + this.maxZ);
        } else {
            c = [0.5 * (this.minX + this.maxX), 0.5 * (this.minY + this.maxY), 0.5 * (this.minZ + this.maxZ)];
        }
        return c;
    }

    /**
        Get the length of the diagonal of the AABB.
        @returns {Number} length of the diagonal.
    */
    lengthOfDiagonal() {
        let xx = this.maxX - this.minX;
        let yy = this.maxY - this.minY;
        let zz = this.maxZ - this.minZ;
        return Math.sqrt(xx * xx + yy * yy + zz * zz);
    }
}
