export class Matrix3x4  {
constructor() {
	this.m00 = 1; this.m01 = 0; this.m02 = 0; this.m03 = 0;
	this.m10 = 0; this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m20 = 0; this.m21 = 0; this.m22 = 1; this.m23 = 0;
};

/**
	Make the matrix an identical matrix.
 */
identity() {
	this.m00 = 1; this.m01 = 0; this.m02 = 0; this.m03 = 0;
	this.m10 = 0; this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m20 = 0; this.m21 = 0; this.m22 = 1; this.m23 = 0;
};

/**
	Scale the matrix using scaling factors on each axial directions.
	@param {Number} sx scaling factors on x-axis.
	@param {Number} sy scaling factors on y-axis.
	@param {Number} sz scaling factors on z-axis.
 */
scale(sx, sy, sz) {
	this.m00 *= sx; this.m01 *= sx; this.m02 *= sx; this.m03 *= sx;
	this.m10 *= sy; this.m11 *= sy; this.m12 *= sy; this.m13 *= sy;
	this.m20 *= sz; this.m21 *= sz; this.m22 *= sz; this.m23 *= sz;
};

/**
	Translate the matrix using translations on each axial directions.
	@param {Number} tx translations on x-axis.
	@param {Number} ty translations on y-axis.
	@param {Number} tz translations on z-axis.
 */
translate(tx, ty, tz) {
	this.m03 += tx;
	this.m13 += ty;
	this.m23 += tz;
};

/**
	Rotate the matrix an arbitrary angle about the x-axis.
	@param {Number} angle rotation angle in degrees.
 */
rotateAboutXAxis(angle) {
	if(angle != 0) {
		angle *= Math.PI / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);

		var m10 = c * this.m10 - s * this.m20;
		var m11 = c * this.m11 - s * this.m21;
		var m12 = c * this.m12 - s * this.m22;
		var m13 = c * this.m13 - s * this.m23;
		var m20 = c * this.m20 + s * this.m10;
		var m21 = c * this.m21 + s * this.m11;
		var m22 = c * this.m22 + s * this.m12;
		var m23 = c * this.m23 + s * this.m13;

		this.m10 = m10; this.m11 = m11; this.m12 = m12; this.m13 = m13;
		this.m20 = m20; this.m21 = m21; this.m22 = m22; this.m23 = m23;
	}
};

/**
	Rotate the matrix an arbitrary angle about the y-axis.
	@param {Number} angle rotation angle in degrees.
 */
rotateAboutYAxis(angle) {
	if(angle != 0) {
		angle *= Math.PI / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);

		var m00 = c * this.m00 + s * this.m20;
		var m01 = c * this.m01 + s * this.m21;
		var m02 = c * this.m02 + s * this.m22;
		var m03 = c * this.m03 + s * this.m23;
		var m20 = c * this.m20 - s * this.m00;
		var m21 = c * this.m21 - s * this.m01;
		var m22 = c * this.m22 - s * this.m02;
		var m23 = c * this.m23 - s * this.m03;

		this.m00 = m00; this.m01 = m01; this.m02 = m02; this.m03 = m03;
		this.m20 = m20; this.m21 = m21; this.m22 = m22; this.m23 = m23;
	}
};

/**
	Rotate the matrix an arbitrary angle about the z-axis.
	@param {Number} angle rotation angle in degrees.
 */
rotateAboutZAxis(angle) {
	if(angle != 0) {
		angle *= Math.PI / 180;
		var c = Math.cos(angle);
		var s = Math.sin(angle);

		var m10 = c * this.m10 + s * this.m00;
		var m11 = c * this.m11 + s * this.m01;
		var m12 = c * this.m12 + s * this.m02;
		var m13 = c * this.m13 + s * this.m03;
		var m00 = c * this.m00 - s * this.m10;
		var m01 = c * this.m01 - s * this.m11;
		var m02 = c * this.m02 - s * this.m12;
		var m03 = c * this.m03 - s * this.m13;

		this.m00 = m00; this.m01 = m01; this.m02 = m02; this.m03 = m03;
		this.m10 = m10; this.m11 = m11; this.m12 = m12; this.m13 = m13;
	}
};

/**
	Multiply the matrix by another matrix.
	@param {JSC3D.Matrix3x4} mult another matrix to be multiplied on this.
 */
multiply(mult) {
	var m00 = mult.m00 * this.m00 + mult.m01 * this.m10 + mult.m02 * this.m20;
	var m01 = mult.m00 * this.m01 + mult.m01 * this.m11 + mult.m02 * this.m21;
	var m02 = mult.m00 * this.m02 + mult.m01 * this.m12 + mult.m02 * this.m22;
	var m03 = mult.m00 * this.m03 + mult.m01 * this.m13 + mult.m02 * this.m23 + mult.m03;
	var m10 = mult.m10 * this.m00 + mult.m11 * this.m10 + mult.m12 * this.m20;
	var m11 = mult.m10 * this.m01 + mult.m11 * this.m11 + mult.m12 * this.m21;
	var m12 = mult.m10 * this.m02 + mult.m11 * this.m12 + mult.m12 * this.m22;
	var m13 = mult.m10 * this.m03 + mult.m11 * this.m13 + mult.m12 * this.m23 + mult.m13;
	var m20 = mult.m20 * this.m00 + mult.m21 * this.m10 + mult.m22 * this.m20;
	var m21 = mult.m20 * this.m01 + mult.m21 * this.m11 + mult.m22 * this.m21;
	var m22 = mult.m20 * this.m02 + mult.m21 * this.m12 + mult.m22 * this.m22;
	var m23 = mult.m20 * this.m03 + mult.m21 * this.m13 + mult.m22 * this.m23 + mult.m23;

	this.m00 = m00; this.m01 = m01; this.m02 = m02; this.m03 = m03;
	this.m10 = m10; this.m11 = m11; this.m12 = m12; this.m13 = m13;
	this.m20 = m20; this.m21 = m21; this.m22 = m22; this.m23 = m23;
};


/**
	@class Math3D

	This class provides some utility methods for 3D mathematics.
 */
}
