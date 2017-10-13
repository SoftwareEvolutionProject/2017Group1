/**
 * @preserve Copyright (c) 2011~2014 Humu <humu2009@gmail.com>
 * This file is part of jsc3d project, which is freely distributable under the
 * terms of the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/**
	@namespace JSC3D
 */
var JSC3D = JSC3D || {};








/**
	@class Mesh

	This class implements mesh that is used as an expression of 3D object and the basic primitive for rendering. <br />
	A mesh basically consists of a sequence of faces, and optioanlly a material, a texture mapping and other attributes and metadata.<br />
	A face consists of 3 or more coplanary vertex that should be descript in counter-clockwise order.<br />
	A texture mapping includes a valid texture object with a sequence of texture coordinats specified per vertex.<br />
 */
JSC3D.Mesh = function(name, visible, material, texture, creaseAngle, isDoubleSided, isEnvironmentCast, coordBuffer, indexBuffer, texCoordBuffer, texCoordIndexBuffer) {
	this.name = name || '';
	this.metadata = '';
	this.visible = (visible != undefined) ? visible : true;
	this.renderMode = null;
	this.aabb = null;
	this.vertexBuffer = coordBuffer || null;
	this.indexBuffer = indexBuffer || null;
	this.vertexNormalBuffer = null;
	this.vertexNormalIndexBuffer = null;
	this.faceNormalBuffer = null;
	this.material = material || null;
	this.texture = texture || null;
	this.faceCount = 0;
	this.creaseAngle = (creaseAngle >= 0) ? creaseAngle : -180;
	this.isDoubleSided = isDoubleSided || false;
	this.isEnvironmentCast = isEnvironmentCast || false;
	this.internalId = 0;
	this.texCoordBuffer = texCoordBuffer || null;
	this.texCoordIndexBuffer = texCoordIndexBuffer || null;
	this.transformedVertexBuffer = null;
	this.transformedVertexNormalZBuffer = null;
	this.transformedFaceNormalZBuffer = null;
	this.transformedVertexNormalBuffer = null;
};

/**
	Initialize the mesh.
 */
JSC3D.Mesh.prototype.init = function() {
	if(this.isTrivial()) {
		return;
	}

	if(this.faceCount == 0) {
		this.calcFaceCount();
		if(this.faceCount == 0)
			return;
	}

	if(!this.aabb) {
		this.aabb = new JSC3D.AABB;
		this.calcAABB();
	}

	if(!this.faceNormalBuffer) {
		this.faceNormalBuffer = new Array(this.faceCount * 3);
		this.calcFaceNormals();
	}

	if(!this.vertexNormalBuffer) {
		if(this.creaseAngle >= 0) {
			this.calcCreasedVertexNormals();
		}
		else {
			this.vertexNormalBuffer = new Array(this.vertexBuffer.length);
			this.calcVertexNormals();
		}
	}

	this.normalizeFaceNormals();

	this.transformedVertexBuffer = new Array(this.vertexBuffer.length);
};

/**
	See if the mesh is a trivial mesh. A trivial mesh should be omited in any calculation or rendering.
	@returns {Boolean} true if it is trivial; false if not.
 */
JSC3D.Mesh.prototype.isTrivial = function() {
	return ( !this.vertexBuffer || this.vertexBuffer.length < 3 ||
			 !this.indexBuffer || this.indexBuffer.length < 3 );
};

/**
	Set material for the mesh.
	@param {JSC3D.Material} material the material object.
 */
JSC3D.Mesh.prototype.setMaterial = function(material) {
	this.material = material;
};

/**
	Set texture for the mesh.
	@param {JSC3D.Texture} texture the texture object.
 */
JSC3D.Mesh.prototype.setTexture = function(texture) {
	this.texture = texture;
};

/**
	See if the mesh has valid texture mapping.
	@returns {Boolean} true if it has valid texture mapping; false if not.
 */
JSC3D.Mesh.prototype.hasTexture = function() {
	return ( (this.texture != null) && this.texture.hasData() &&
			 (this.texCoordBuffer != null) && (this.texCoordBuffer.length >= 2) &&
			 ((this.texCoordIndexBuffer == null) || ((this.texCoordIndexBuffer.length >= 3) && (this.texCoordIndexBuffer.length >= this.indexBuffer.length))) );
};

/**
	Set render mode of the mesh.<br />
	Available render modes are:<br />
	'<b>point</b>':         render meshes as point clouds;<br />
	'<b>wireframe</b>':     render meshes as wireframe;<br />
	'<b>flat</b>':          render meshes as solid objects using flat shading;<br />
	'<b>smooth</b>':        render meshes as solid objects using smooth shading;<br />
	'<b>texture</b>':       render meshes as solid textured objects, no lighting will be apllied;<br />
	'<b>textureflat</b>':   render meshes as solid textured objects, lighting will be calculated per face;<br />
	'<b>texturesmooth</b>': render meshes as solid textured objects, lighting will be calculated per vertex and interpolated.<br />
	@param {String} mode new render mode.
 */
JSC3D.Mesh.prototype.setRenderMode = function(mode) {
	this.renderMode = mode;
};

/**
	Calculate count of faces.
	@private
 */
JSC3D.Mesh.prototype.calcFaceCount = function() {
	this.faceCount = 0;

	var ibuf = this.indexBuffer;

	// add the last -1 if it is omitted
	if(ibuf[ibuf.length - 1] != -1)
		ibuf.push(-1);

	for(var i=0; i<ibuf.length; i++) {
		if(ibuf[i] == -1)
			this.faceCount++;
	}
};

/**
	Calculate AABB of the mesh.
	@private
 */
JSC3D.Mesh.prototype.calcAABB = function() {
	var minX = minY = minZ = Infinity;
	var maxX = maxY = maxZ = -Infinity;

	var vbuf = this.vertexBuffer;
	for(var i=0; i<vbuf.length; i+=3) {
		var x = vbuf[i    ];
		var y = vbuf[i + 1];
		var z = vbuf[i + 2];

		if(x < minX)
			minX = x;
		if(x > maxX)
			maxX = x;
		if(y < minY)
			minY = y;
		if(y > maxY)
			maxY = y;
		if(z < minZ)
			minZ = z;
		if(z > maxZ)
			maxZ = z;
	}

	this.aabb.minX = minX;
	this.aabb.minY = minY;
	this.aabb.minZ = minZ;
	this.aabb.maxX = maxX;
	this.aabb.maxY = maxY;
	this.aabb.maxZ = maxZ;
};

/**
	Calculate per face normals. The reault remain un-normalized for later vertex normal calculations.
	@private
 */
JSC3D.Mesh.prototype.calcFaceNormals = function() {
	var vbuf = this.vertexBuffer;
	var ibuf = this.indexBuffer;
	var nbuf = this.faceNormalBuffer;
	var i = 0, j = 0;
	while(i < ibuf.length) {
		var index = ibuf[i++] * 3;
		var x0 = vbuf[index    ];
		var y0 = vbuf[index + 1];
		var z0 = vbuf[index + 2];

		index = ibuf[i++] * 3;
		var x1 = vbuf[index    ];
		var y1 = vbuf[index + 1];
		var z1 = vbuf[index + 2];

		index = ibuf[i++] * 3;
		var x2 = vbuf[index    ];
		var y2 = vbuf[index + 1];
		var z2 = vbuf[index + 2];

		var dx1 = x1 - x0;
		var dy1 = y1 - y0;
		var dz1 = z1 - z0;
		var dx2 = x2 - x0;
		var dy2 = y2 - y0;
		var dz2 = z2 - z0;

		var nx = dy1 * dz2 - dz1 * dy2;
		var ny = dz1 * dx2 - dx1 * dz2;
		var nz = dx1 * dy2 - dy1 * dx2;

		nbuf[j++] = nx;
		nbuf[j++] = ny;
		nbuf[j++] = nz;

		do {
		} while (ibuf[i++] != -1);
	}
};

/**
	Normalize face normals.
	@private
 */
JSC3D.Mesh.prototype.normalizeFaceNormals = function() {
	JSC3D.Math3D.normalizeVectors(this.faceNormalBuffer, this.faceNormalBuffer);
};

/**
	Calculate per vertex normals.
	@private
 */
JSC3D.Mesh.prototype.calcVertexNormals = function() {
	if(!this.faceNormalBuffer) {
		this.faceNormalBuffer = new Array(this.faceCount * 3);
		this.calcFaceNormals();
	}

	var vbuf = this.vertexBuffer;
	var ibuf = this.indexBuffer;
	var fnbuf = this.faceNormalBuffer;
	var vnbuf = this.vertexNormalBuffer;
	for(var i=0; i<vnbuf.length; i++) {
		vnbuf[i] = 0;
	}

	// in this case, the vertex normal index buffer should be set to null
	// since the vertex index buffer will be used to reference vertex normals
	this.vertexNormalIndexBuffer = null;

	var numOfVertices = vbuf.length / 3;

	/*
		Generate vertex normals.
		Normals of faces around each vertex will be summed to calculate that vertex normal.
	*/
	var i = 0, j = 0, k = 0;
	while(i < ibuf.length) {
		k = ibuf[i++];
		if(k == -1) {
			j += 3;
		}
		else {
			var index = k * 3;
			// add face normal to vertex normal
			vnbuf[index    ] += fnbuf[j    ];
			vnbuf[index + 1] += fnbuf[j + 1];
			vnbuf[index + 2] += fnbuf[j + 2];
		}
	}

	// normalize vertex normals
	JSC3D.Math3D.normalizeVectors(vnbuf, vnbuf);
};

/**
	Calculate per vertex normals. The given crease-angle will be taken into account.
	@private
 */
JSC3D.Mesh.prototype.calcCreasedVertexNormals = function() {
	if(!this.faceNormalBuffer) {
		this.faceNormalBuffer = new Array(this.faceCount * 3);
		this.calcFaceNormals();
	}

	var ibuf = this.indexBuffer;
	var numOfVerts = this.vertexBuffer.length / 3;

	/*
		Go through vertices. For each one, record the indices of faces who touch this vertex.
		The new length of the vertex normal buffer will also be calculated.
	*/
	var vertTouchedFaces = new Array(numOfVerts);
	var expectedVertNormalBufferLength = 0;
	for(var i=0, findex=0, vindex=0; i<ibuf.length; i++) {
		vindex = ibuf[i];
		if(vindex >= 0) {
			expectedVertNormalBufferLength += 3;
			var faces = vertTouchedFaces[vindex];
			if(!faces)
				vertTouchedFaces[vindex] = [findex];
			else
				faces.push(findex);
		}
		else {
			findex++;
		}
	}

	var fnbuf = this.faceNormalBuffer;
	// generate normalized face normals which will be used for calculating dot product
	var nfnbuf = new Array(fnbuf.length);
	JSC3D.Math3D.normalizeVectors(fnbuf, nfnbuf);

	// realloc and initialize the vertex normal buffer
	if(!this.vertexNormalBuffer || this.vertexNormalBuffer.length < expectedVertNormalBufferLength)
		this.vertexNormalBuffer = new Array(expectedVertNormalBufferLength);
	var vnbuf = this.vertexNormalBuffer;
	for(var i=0; i<vnbuf.length; i++) {
		vnbuf[i] = 0;
	}

	// the vertex normal index buffer will be re-calculated
	this.vertexNormalIndexBuffer = [];
	var nibuf = this.vertexNormalIndexBuffer;

	/*
		Generate vertex normals and normal indices.
		In this case, There will be a separate normal for each vertex of each face.
	*/
	var threshold = Math.cos(this.creaseAngle * Math.PI / 180);
	for(var i=0, vindex=0, nindex=0, findex0=0; i<ibuf.length; i++) {
		vindex = ibuf[i];
		if(vindex >= 0) {
			var n = nindex * 3;
			var f0 = findex0 * 3;
			// add face normal to vertex normal
			vnbuf[n    ] += fnbuf[f0    ];
			vnbuf[n + 1] += fnbuf[f0 + 1];
			vnbuf[n + 2] += fnbuf[f0 + 2];
			var fnx0 = nfnbuf[f0    ];
			var fny0 = nfnbuf[f0 + 1];
			var fnz0 = nfnbuf[f0 + 2];
			// go through faces around this vertex, accumulating normals
			var faces = vertTouchedFaces[vindex];
			for(var j=0; j<faces.length; j++) {
				var findex1 = faces[j];
				if(findex0 != findex1) {
					var f1 = findex1 * 3;
					var fnx1 = nfnbuf[f1    ];
					var fny1 = nfnbuf[f1 + 1];
					var fnz1 = nfnbuf[f1 + 2];
					// if the angle between normals of the adjacent faces is less than the crease-angle, the
					// normal of the other face will be accumulated to the vertex normal of the current face
					if(fnx0 * fnx1 + fny0 * fny1 + fnz0 * fnz1 > threshold) {
						vnbuf[n    ] += fnbuf[f1    ];
						vnbuf[n + 1] += fnbuf[f1 + 1];
						vnbuf[n + 2] += fnbuf[f1 + 2];
					}
				}
			}
			nibuf.push(nindex++);
		}
		else {
			findex0++;
			nibuf.push(-1);
		}
	}

	// normalize the results
	JSC3D.Math3D.normalizeVectors(vnbuf, vnbuf);
};

JSC3D.Mesh.prototype.checkValid = function() {
	//TODO: not implemented yet
};

/**
 * {String} Name of the mesh.
 */
JSC3D.Mesh.prototype.name = '';
JSC3D.Mesh.prototype.metadata = '';
/**
 * {Boolean} Visibility of the mesh. If it is set to false, the mesh will be ignored in rendering.
 */
JSC3D.Mesh.prototype.visible = false;
JSC3D.Mesh.prototype.renderMode = 'flat';
/**
 * {JSC3D.AABB} The Axis-aligned bounding box of the mesh. Read only.
 */
JSC3D.Mesh.prototype.aabb = null;
/**
 * {Array} The plain sequence of vertex coordinates of the mesh.
 */
JSC3D.Mesh.prototype.vertexBuffer = null;
/**
 * {Array} The sequence of vertex indices that describe faces. Each face contains at least 3 vertex
 * indices that are ended by a -1. Faces are not limited to triangles.
 */
JSC3D.Mesh.prototype.indexBuffer = null;
JSC3D.Mesh.prototype.vertexNormalBuffer = null;
JSC3D.Mesh.prototype.vertexNormalIndexBuffer = null;
JSC3D.Mesh.prototype.faceNormalBuffer = null;
/**
 * {Array} The plain sequence of texture coordinates of the mesh, or null if none.
 */
JSC3D.Mesh.prototype.texCoordBuffer = null;
/**
 * {Array} The sequence of tex coord indices. If it is null, the indexBuffer will be used.
 */
JSC3D.Mesh.prototype.texCoordIndexBuffer = null;
JSC3D.Mesh.prototype.material = null;
JSC3D.Mesh.prototype.texture = null;
/**
 * {Number} Number of faces of the mesh. Read only.
 */
JSC3D.Mesh.prototype.faceCount = 0;
/**
 * {Number} An angle to preserve sharp edges in smooth rendering. If the angle between the normals of two adjacent faces exceeds this value, the edge will be recognized as an sharp edge thus it will not be smoothed.
 */
JSC3D.Mesh.prototype.creaseAngle = -180;
/**
 * {Boolean} If set to true, both sides of the faces will be rendered.
 */
JSC3D.Mesh.prototype.isDoubleSided = false;
/**
 * {Boolean} If set to true, the mesh accepts environment mapping.
 */
JSC3D.Mesh.prototype.isEnvironmentCast = false;
JSC3D.Mesh.prototype.internalId = 0;
JSC3D.Mesh.prototype.transformedVertexBuffer = null;
JSC3D.Mesh.prototype.transformedVertexNormalZBuffer = null;
JSC3D.Mesh.prototype.transformedFaceNormalZBuffer = null;
JSC3D.Mesh.prototype.transformedVertexNormalBuffer = null;







/**
	Make the matrix an identical matrix.
 */
JSC3D.Matrix3x4.prototype.identity = function() {
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
JSC3D.Matrix3x4.prototype.scale = function(sx, sy, sz) {
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
JSC3D.Matrix3x4.prototype.translate = function(tx, ty, tz) {
	this.m03 += tx;
	this.m13 += ty;
	this.m23 += tz;
};

/**
	Rotate the matrix an arbitrary angle about the x-axis.
	@param {Number} angle rotation angle in degrees.
 */
JSC3D.Matrix3x4.prototype.rotateAboutXAxis = function(angle) {
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
JSC3D.Matrix3x4.prototype.rotateAboutYAxis = function(angle) {
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
JSC3D.Matrix3x4.prototype.rotateAboutZAxis = function(angle) {
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
JSC3D.Matrix3x4.prototype.multiply = function(mult) {
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




JSC3D.Util = {

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




/**
	@class BinaryStream
	The helper class to parse data from a binary stream.
 */
JSC3D.BinaryStream = function(data, isBigEndian) {
	if(isBigEndian)
		throw 'JSC3D.BinaryStream constructor failed: Big endian is not supported yet!';

	this.data = data;
	this.offset = 0;
};

/**
	Get the full length (in bytes) of the stream.
	@returns {Number} the length of the stream.
 */
JSC3D.BinaryStream.prototype.size = function() {
	return this.data.length;
};

/**
	Get current position of the indicator.
	@returns {Number} current position in stream.
 */
JSC3D.BinaryStream.prototype.tell = function() {
	return this.offset;
};

/**
	Set the position indicator of the stream to a new position.
	@param {Number} position the new position.
	@returns {Boolean} true if succeeded; false if the given position is out of range.
 */
JSC3D.BinaryStream.prototype.seek = function(position) {
	if(position < 0 || position >= this.data.length)
		return false;

	this.offset = position;

	return true;
};

/**
	Reset the position indicator to the beginning of the stream.
 */
JSC3D.BinaryStream.prototype.reset = function() {
	this.offset = 0;
};

/**
	Advance the position indicator to skip a given number of bytes.
	@param {Number} bytesToSkip the number of bytes to skip.
 */
JSC3D.BinaryStream.prototype.skip = function(bytesToSkip) {
	if(this.offset + bytesToSkip > this.data.length)
		this.offset = this.data.length;
	else
		this.offset += bytesToSkip;
};

/**
	Get count of the remaining bytes in the stream.
	@returns {Number} the number of bytes from current position to the end of the stream.
 */
JSC3D.BinaryStream.prototype.available = function() {
	return this.data.length - this.offset;
};

/**
	See if the position indicator is already at the end of the stream.
	@returns {Boolean} true if the position indicator is at the end of the stream; false if not.
 */
JSC3D.BinaryStream.prototype.eof = function() {
	return !(this.offset < this.data.length);
};

/**
	Read an 8-bits' unsigned int number.
	@returns {Number} an 8-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt8 = function() {
	return this.decodeInt(1, false);
};

/**
	Read an 8-bits' signed int number.
	@returns {Number} an 8-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt8 = function() {
	return this.decodeInt(1, true);
};

/**
	Read a 16-bits' unsigned int number.
	@returns {Number} a 16-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt16 = function() {
	return this.decodeInt(2, false);
};

/**
	Read a 16-bits' signed int number.
	@returns {Number} a 16-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt16 = function() {
	return this.decodeInt(2, true);
};

/**
	Read a 32-bits' unsigned int number.
	@returns {Number} a 32-bits' unsigned int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readUInt32 = function() {
	return this.decodeInt(4, false);
};

/**
	Read a 32-bits' signed int number.
	@returns {Number} a 32-bits' signed int number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readInt32 = function() {
	return this.decodeInt(4, true);
};

/**
	Read a 32-bits' (IEEE 754) floating point number.
	@returns {Number} a 32-bits' floating point number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readFloat32 = function() {
	return this.decodeFloat(4, 23);
};

/**
	Read a 64-bits' (IEEE 754) floating point number.
	@returns {Number} a 64-bits' floating point number, or NaN if any error occured.
 */
JSC3D.BinaryStream.prototype.readFloat64 = function() {
	return this.decodeFloat(8, 52);
};

/**
	Read a piece of the stream into a given buffer.
	@param {Array} buffer the buffer to receive the result.
	@param {Number} bytesToRead length of the piece to be read, in bytes.
	@returns {Number} the total number of bytes that are successfully read.
 */
JSC3D.BinaryStream.prototype.readBytes = function(buffer, bytesToRead) {
	var bytesRead = bytesToRead;
	if(this.offset + bytesToRead > this.data.length)
		bytesRead = this.data.length - this.offset;

	for(var i=0; i<bytesRead; i++) {
		buffer[i] = this.data[this.offset++].charCodeAt(0) & 0xff;
	}

	return bytesRead;
};

/**
	@private
 */
JSC3D.BinaryStream.prototype.decodeInt = function(bytes, isSigned) {
	// are there enough bytes for this integer?
	if(this.offset + bytes > this.data.length) {
		this.offset = this.data.length;
		return NaN;
	}

	var rv = 0, f = 1;
	for(var i=0; i<bytes; i++) {
		rv += ((this.data[this.offset++].charCodeAt(0) & 0xff) * f);
		f *= 256;
	}

	if( isSigned && (rv & Math.pow(2, bytes * 8 - 1)) )
		rv -= Math.pow(2, bytes * 8);

	return rv;
};

/**
	@private
 */
JSC3D.BinaryStream.prototype.decodeFloat = function(bytes, significandBits) {
	// are there enough bytes for the float?
	if(this.offset + bytes > this.data.length) {
		this.offset = this.data.length;
		return NaN;
	}

	var mLen = significandBits;
	var eLen = bytes * 8 - mLen - 1;
	var eMax = (1 << eLen) - 1;
	var eBias = eMax >> 1;

	var i = bytes - 1;
	var d = -1;
	var s = this.data[this.offset + i].charCodeAt(0) & 0xff;
	i += d;
	var bits = -7;
	var e = s & ((1 << (-bits)) - 1);
	s >>= -bits;
	bits += eLen;
	while(bits > 0) {
		e = e * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
		i += d;
		bits -= 8;
	}

	var m = e & ((1 << (-bits)) - 1);
	e >>= -bits;
	bits += mLen;
	while(bits > 0) {
		m = m * 256 + (this.data[this.offset + i].charCodeAt(0) & 0xff);
		i += d;
		bits -= 8;
	}

	this.offset += bytes;

	switch(e) {
	case 0:		// 0 or denormalized number
		e = 1 - eBias;
		break;
	case eMax:	// NaN or +/-Infinity
		return m ? NaN : ((s ? -1 : 1) * Infinity);
	default:	// normalized number
		m += Math.pow(2, mLen);
		e -= eBias;
		break;
	}

	return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};




/**
	@class ObjLoader

	This class implements a scene loader from a Wavefront obj file.
 */
JSC3D.ObjLoader = function(onload, onerror, onprogress, onresource) {
	this.onload = (onload && typeof(onload) == 'function') ? onload : null;
	this.onerror = (onerror && typeof(onerror) == 'function') ? onerror : null;
	this.onprogress = (onprogress && typeof(onprogress) == 'function') ? onprogress : null;
	this.onresource = (onresource && typeof(onresource) == 'function') ? onresource : null;
	this.requestCount = 0;
	this.requests = [];
};

/**
	Load scene from a given obj file.
	@param {String} urlName a string that specifies where to fetch the obj file.
 */
JSC3D.ObjLoader.prototype.loadFromUrl = function(urlName) {
	var urlPath = '';
	var fileName = urlName;
	var queryPart = '';

	var questionMarkAt = urlName.indexOf('?');
	if(questionMarkAt >= 0) {
		queryPart = urlName.substring(questionMarkAt);
		fileName = urlName = urlName.substring(0, questionMarkAt);
	}

	var lastSlashAt = urlName.lastIndexOf('/');
	if(lastSlashAt == -1)
		lastSlashAt = urlName.lastIndexOf('\\');
	if(lastSlashAt != -1) {
		urlPath = urlName.substring(0, lastSlashAt+1);
		fileName = urlName.substring(lastSlashAt+1);
	}

	this.requestCount = 0;
	this.loadObjFile(urlPath, fileName, queryPart);
};

/**
	Abort current loading if it is not finished yet.
 */
JSC3D.ObjLoader.prototype.abort = function() {
	for(var i=0; i<this.requests.length; i++) {
		this.requests[i].abort();
	}
	this.requests = [];
	this.requestCount = 0;
};

/**
	Load scene from the obj file using the given url path and file name.
	@private
 */
JSC3D.ObjLoader.prototype.loadObjFile = function(urlPath, fileName, queryPart) {
	var urlName = urlPath + fileName + queryPart;
	var self = this;
	var xhr = new XMLHttpRequest;
	xhr.open('GET', encodeURI(urlName), true);

	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200 || this.status == 0) {
				if(self.onload) {
					if(self.onprogress)
						self.onprogress('Loading obj file ...', 1);
					if(JSC3D.console)
						JSC3D.console.logInfo('Finished loading obj file "' + urlName + '".');
					var scene = new JSC3D.Scene;
					scene.srcUrl = urlName;
					var mtllibs = self.parseObj(scene, this.responseText);
					if(mtllibs.length > 0) {
						for(var i=0; i<mtllibs.length; i++)
							self.loadMtlFile(scene, urlPath, mtllibs[i]);
					}
					self.requests.splice(self.requests.indexOf(this), 1);
					if(--self.requestCount == 0)
						self.onload(scene);
				}
			}
			else {
				self.requests.splice(self.requests.indexOf(this), 1);
				self.requestCount--;
				if(JSC3D.console)
					JSC3D.console.logError('Failed to load obj file "' + urlName + '".');
				if(self.onerror)
					self.onerror('Failed to load obj file "' + urlName + '".');
			}
		}
	};

	if(this.onprogress) {
		this.onprogress('Loading obj file ...', 0);
		xhr.onprogress = function(event) {
			self.onprogress('Loading obj file ...', event.position / event.totalSize);
		};
	}

	this.requests.push(xhr);
	this.requestCount++;
	xhr.send();
};

/**
	Load materials and textures from an mtl file and set them to corresponding meshes.
	@private
 */
JSC3D.ObjLoader.prototype.loadMtlFile = function(scene, urlPath, fileName) {
	var urlName = urlPath + fileName;
	var self = this;
	var xhr = new XMLHttpRequest;
	xhr.open('GET', encodeURI(urlName), true);

	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200 || this.status == 0) {
				if(self.onprogress)
					self.onprogress('Loading mtl file ...', 1);
				if(JSC3D.console)
					JSC3D.console.logInfo('Finished loading mtl file "' + urlName + '".');
				var mtls = self.parseMtl(this.responseText);
				var textures = {};
				var meshes = scene.getChildren();
				for(var i=0; i<meshes.length; i++) {
					var mesh = meshes[i];
					if(mesh.mtl != null && mesh.mtllib != null && mesh.mtllib == fileName) {
						var mtl = mtls[mesh.mtl];
						if(mtl != null) {
							if(mtl.material != null)
								mesh.setMaterial(mtl.material);
							if(mtl.textureFileName != '') {
								if(!textures[mtl.textureFileName])
									textures[mtl.textureFileName] = [mesh];
								else
									textures[mtl.textureFileName].push(mesh);
							}
						}
					}
				}
				for(var textureFileName in textures)
					self.setupTexture(textures[textureFileName], urlPath + textureFileName);
			}
			else {
				//TODO: when failed to load an mtl file ...
				if(JSC3D.console)
					JSC3D.console.logWarning('Failed to load mtl file "' + urlName + '". A default material will be applied.');
			}
			self.requests.splice(self.requests.indexOf(this), 1);
			if(--self.requestCount == 0)
				self.onload(scene);
		}
	};

	if(this.onprogress) {
		this.onprogress('Loading mtl file ...', 0);
		xhr.onprogress = function(event) {
			self.onprogress('Loading mtl file ...', event.position / event.totalSize);
		};
	}

	this.requests.push(xhr);
	this.requestCount++;
	xhr.send();
};

/**
	Parse contents of the obj file, generating the scene and returning all required mtllibs.
	@private
 */
JSC3D.ObjLoader.prototype.parseObj = function(scene, data) {
	var meshes = {};
	var mtllibs = [];
	var namePrefix = 'obj-';
	var meshIndex = 0;
	var curMesh = null;
	var curMtllibName = '';
	var curMtlName = '';

	var tempVertexBuffer = [];		// temporary buffer as container for all vertices
	var tempTexCoordBuffer = [];	// temporary buffer as container for all vertex texture coords

	// create a default mesh to hold all faces that are not associated with any mtl.
	var defaultMeshName = namePrefix + meshIndex++;
	var defaultMesh = new JSC3D.Mesh;
	defaultMesh.name = defaultMeshName;
	defaultMesh.indexBuffer = [];
	meshes['nomtl'] = defaultMesh;
	curMesh = defaultMesh;

	var lines = data.split(/[ \t]*\r?\n[ \t]*/);
	for(var i=0; i<lines.length; i++) {
		var line = lines[i];
		var tokens = line.split(/[ \t]+/);
		if(tokens.length > 0) {
			var keyword = tokens[0];
			switch(keyword) {
			case 'v':
				if(tokens.length > 3) {
					for(var j=1; j<4; j++) {
						tempVertexBuffer.push( parseFloat(tokens[j]) );
					}
				}
				break;
			case 'vn':
				// Ignore vertex normals. These will be calculated automatically when a mesh is initialized.
				break;
			case 'vt':
				if(tokens.length > 2) {
					tempTexCoordBuffer.push( parseFloat(tokens[1]) );
					tempTexCoordBuffer.push( 1 - parseFloat(tokens[2]) );
				}
				break;
			case 'f':
				if(tokens.length > 3) {
					for(var j=1; j<tokens.length; j++) {
						var refs = tokens[j].split('/');
						var index = parseInt(refs[0]) - 1;
						curMesh.indexBuffer.push(index);
						if(refs.length > 1) {
							if(refs[1] != '') {
								if(!curMesh.texCoordIndexBuffer)
									curMesh.texCoordIndexBuffer = [];
								curMesh.texCoordIndexBuffer.push( parseInt(refs[1]) - 1 );
							}
							// Patch to deal with non-standard face statements in obj files generated by LightWave3D.
							else if(refs.length < 3 || refs[2] == '') {
								if(!curMesh.texCoordIndexBuffer)
									curMesh.texCoordIndexBuffer = [];
								curMesh.texCoordIndexBuffer.push(index);
							}
						}
					}
					curMesh.indexBuffer.push(-1);				// mark the end of vertex index sequence for the face
					if(curMesh.texCoordIndexBuffer)
						curMesh.texCoordIndexBuffer.push(-1);	// mark the end of vertex tex coord index sequence for the face
				}
				break;
			case 'mtllib':
				if(tokens.length > 1) {
					curMtllibName = tokens[1];
					mtllibs.push(curMtllibName);
				}
				else
					curMtllibName = '';
				break;
			case 'usemtl':
				if(tokens.length > 1 && tokens[1] != '' && curMtllibName != '') {
					curMtlName = tokens[1];
					var meshid = curMtllibName + '-' + curMtlName;
					var mesh = meshes[meshid];
					if(!mesh) {
						// create a new mesh to accept faces using the same mtl
						mesh = new JSC3D.Mesh;
						mesh.name = namePrefix + meshIndex++;
						mesh.indexBuffer = [];
						mesh.mtllib = curMtllibName;
						mesh.mtl = curMtlName;
						meshes[meshid] = mesh;
					}
					curMesh = mesh;
				}
				else {
					curMtlName = '';
					curMesh = defaultMesh;
				}
				break;
			case '#':
				// ignore comments
			default:
				break;
			}
		}
	}

	var viBuffer = tempVertexBuffer.length >= 3 ? (new Array(tempVertexBuffer.length / 3)) : null;
	var tiBuffer = tempTexCoordBuffer.length >= 2 ? (new Array(tempTexCoordBuffer.length / 2)) : null;

	for(var id in meshes) {
		var mesh = meshes[id];

		// split vertices into the mesh, the indices are also re-calculated
		if(tempVertexBuffer.length >= 3 && mesh.indexBuffer.length > 0) {
			for(var i=0; i<viBuffer.length; i++)
				viBuffer[i] = -1;

			mesh.vertexBuffer = [];
			var oldVI = 0, newVI = 0;
			for(var i=0; i<mesh.indexBuffer.length; i++) {
				oldVI = mesh.indexBuffer[i];
				if(oldVI != -1) {
					if(viBuffer[oldVI] == -1) {
						var v = oldVI * 3;
						mesh.vertexBuffer.push(tempVertexBuffer[v    ]);
						mesh.vertexBuffer.push(tempVertexBuffer[v + 1]);
						mesh.vertexBuffer.push(tempVertexBuffer[v + 2]);
						mesh.indexBuffer[i] = newVI;
						viBuffer[oldVI] = newVI;
						newVI++;
					}
					else {
						mesh.indexBuffer[i] = viBuffer[oldVI];
					}
				}
			}
		}

		// split vertex texture coords into the mesh, the indices for texture coords are re-calculated as well
		if(tempTexCoordBuffer.length >= 2 && mesh.texCoordIndexBuffer != null && mesh.texCoordIndexBuffer.length > 0) {
			for(var i=0; i<tiBuffer.length; i++)
				tiBuffer[i] = -1;

			mesh.texCoordBuffer = [];
			var oldTI = 0, newTI = 0;
			for(var i=0; i<mesh.texCoordIndexBuffer.length; i++) {
				oldTI = mesh.texCoordIndexBuffer[i];
				if(oldTI != -1) {
					if(tiBuffer[oldTI] == -1) {
						var t = oldTI * 2;
						mesh.texCoordBuffer.push(tempTexCoordBuffer[t    ]);
						mesh.texCoordBuffer.push(tempTexCoordBuffer[t + 1]);
						mesh.texCoordIndexBuffer[i] = newTI;
						tiBuffer[oldTI] = newTI;
						newTI++;
					}
					else {
						mesh.texCoordIndexBuffer[i] = tiBuffer[oldTI];
					}
				}
			}
		}

		// add mesh to scene
		if(!mesh.isTrivial())
			scene.addChild(mesh);
	}

	return mtllibs;
};

/**
	Parse contents of an mtl file, returning all materials and textures defined in it.
	@private
 */
JSC3D.ObjLoader.prototype.parseMtl = function(data) {
	var mtls = {};
	var curMtlName = '';

	var lines = data.split(/[ \t]*\r?\n[ \t]*/);
	for(var i=0; i<lines.length; i++) {
		var line = lines[i];
		var tokens = line.split(/[ \t]+/);
		if(tokens.length > 0) {
			var keyword = tokens[0];
			/*
			 * This has been fixed by Laurent Piroelle <laurent.piroelle@fabzat.com> to deal with mtl
			 * keywords in wrong case caused by some exporting tools.
			 */
			switch(keyword) {
			case 'newmtl':
				curMtlName = tokens[1];
				var mtl = {};
				mtl.material = new JSC3D.Material;
				mtl.material.name = curMtlName;
				mtl.textureFileName = '';
				mtls[curMtlName] = mtl;
				break;
			case 'Ka':
			case 'ka':
				/*
				if(tokens.length == 4 && !isNaN(tokens[1])) {
					var ambientR = (parseFloat(tokens[1]) * 255) & 0xff;
					var ambientG = (parseFloat(tokens[2]) * 255) & 0xff;
					var ambientB = (parseFloat(tokens[3]) * 255) & 0xff;
					var mtl = mtls[curMtlName];
					if(mtl != null)
						mtl.material.ambientColor = (ambientR << 16) | (ambientG << 8) | ambientB;
				}
				*/
				break;
			case 'Kd':
			case 'kd':
				if(tokens.length == 4 && !isNaN(tokens[1])) {
					var diffuseR = (parseFloat(tokens[1]) * 255) & 0xff;
					var diffuseG = (parseFloat(tokens[2]) * 255) & 0xff;
					var diffuseB = (parseFloat(tokens[3]) * 255) & 0xff;
					var mtl = mtls[curMtlName];
					if(mtl != null)
						mtl.material.diffuseColor = (diffuseR << 16) | (diffuseG << 8) | diffuseB;
				}
				break;
			case 'Ks':
			case 'ks':
				// ignore specular reflectivity definition
				break;
			case 'd':
				if(tokens.length == 2 && !isNaN(tokens[1])) {
					var opacity = parseFloat(tokens[1]);
					var mtl = mtls[curMtlName];
					if(mtl != null)
						mtl.material.transparency = 1 - opacity;
				}
				break;
			case 'illum':
				/*
				if(tokens.length == 2 && tokens[1] == '2') {
					var mtl = mtls[curMtlName];
					if(mtl != null)
						mtl.material.simulateSpecular = true;
				}
				*/
				break;
			case 'map_Kd':
			case 'map_kd':
				if(tokens.length == 2) {
					var texFileName = tokens[1];
					var mtl = mtls[curMtlName];
					if(mtl != null)
						mtl.textureFileName = texFileName;
				}
				break;
			case '#':
				// ignore any comment
			default:
				break;
			}
		}
	}

	return mtls;
};

/**
	Asynchronously load a texture from a given url and set it to corresponding meshes when done.
	@private
 */
JSC3D.ObjLoader.prototype.setupTexture = function(meshList, textureUrlName) {
	var self = this;
	var texture = new JSC3D.Texture;

	texture.onready = function() {
		for(var i=0; i<meshList.length; i++)
			meshList[i].setTexture(this);
		if(self.onresource)
			self.onresource(this);
	};

	texture.createFromUrl(textureUrlName);
};

JSC3D.ObjLoader.prototype.onload = null;
JSC3D.ObjLoader.prototype.onerror = null;
JSC3D.ObjLoader.prototype.onprogress = null;
JSC3D.ObjLoader.prototype.onresource = null;
JSC3D.ObjLoader.prototype.requestCount = 0;

JSC3D.LoaderSelector.registerLoader('obj', JSC3D.ObjLoader);


/**
	@class StlLoader

	This class implements a scene loader from an STL file. Both binary and ASCII STL files are supported.
 */
JSC3D.StlLoader = function(onload, onerror, onprogress, onresource) {
	this.onload = (onload && typeof(onload) == 'function') ? onload : null;
	this.onerror = (onerror && typeof(onerror) == 'function') ? onerror : null;
	this.onprogress = (onprogress && typeof(onprogress) == 'function') ? onprogress : null;
	this.onresource = (onresource && typeof(onresource) == 'function') ? onresource : null;
	this.decimalPrecision = 3;
	this.request = null;
};

/**
	Load scene from a given STL file.
	@param {String} urlName a string that specifies where to fetch the STL file.
 */
JSC3D.StlLoader.prototype.loadFromUrl = function(urlName) {
	var self = this;
	var isIE = JSC3D.PlatformInfo.browser == 'ie';
	//TODO: current blob implementation seems do not work correctly on IE10. Repair it or turn to an arraybuffer implementation.
	var isIE10Compatible = false;//(isIE && parseInt(JSC3D.PlatformInfo.version) >= 10);
	var xhr = new XMLHttpRequest;
	xhr.open('GET', encodeURI(urlName), true);
	if(isIE10Compatible)
		xhr.responseType = 'blob';	// use blob method to deal with STL files for IE >= 10
	else if(isIE)
		xhr.setRequestHeader("Accept-Charset", "x-user-defined");
	else
		xhr.overrideMimeType('text/plain; charset=x-user-defined');

	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			if(this.status == 200 || this.status == 0) {
				if(JSC3D.console)
					JSC3D.console.logInfo('Finished loading STL file "' + urlName + '".');
				if(self.onload) {
					if(self.onprogress)
						self.onprogress('Loading STL file ...', 1);
					if(isIE10Compatible) {
						// asynchronously decode blob to binary string
						var blobReader = new FileReader;
						blobReader.onload = function(event) {
							var scene = new JSC3D.Scene;
							scene.srcUrl = urlName;
							self.parseStl(scene, event.target.result);
							self.onload(scene);
						};
						blobReader.readAsText(this.response, 'x-user-defined');
					}
					else if(isIE) {
						// decode data from XHR's responseBody into a binary string, since it cannot be accessed directly from javascript.
						// this would work on IE6~IE9
						var scene = new JSC3D.Scene;
						scene.srcUrl = urlName;
						try {
							self.parseStl(scene, JSC3D.Util.ieXHRResponseBodyToString(this.responseBody));
						} catch(e) {}
						self.onload(scene);
					}
					else {
						var scene = new JSC3D.Scene;
						scene.srcUrl = urlName;
						self.parseStl(scene, this.responseText);
						self.onload(scene);
					}
				}
			}
			else {
				if(JSC3D.console)
					JSC3D.console.logError('Failed to load STL file "' + urlName + '".');
				if(self.onerror)
					self.onerror('Failed to load STL file "' + urlName + '".');
			}
			self.request = null;
		}
	};

	if(this.onprogress) {
		this.onprogress('Loading STL file ...', 0);
		xhr.onprogress = function(event) {
			self.onprogress('Loading STL file ...', event.position / event.totalSize);
		};
	}

	this.request = xhr;
	xhr.send();
};

/**
	Abort current loading if it is not finished yet.
 */
JSC3D.StlLoader.prototype.abort = function() {
	if(this.request) {
		this.request.abort();
		this.request = null;
	}
};

/**
	Set decimal precision that defines the threshold to detect and weld vertices that coincide.
	@param {Number} precision the decimal preciison.
 */
JSC3D.StlLoader.prototype.setDecimalPrecision = function(precision) {
	this.decimalPrecision = precision;
};

/**
	Parse contents of an STL file and generate the scene.
	@private
 */
JSC3D.StlLoader.prototype.parseStl = function(scene, data) {
	var FACE_VERTICES           = 3;

	var HEADER_BYTES            = 80;
	var FACE_COUNT_BYTES        = 4;
	var FACE_NORMAL_BYTES       = 12;
	var VERTEX_BYTES            = 12;
	var ATTRIB_BYTE_COUNT_BYTES = 2;

	var mesh = new JSC3D.Mesh;
	mesh.vertexBuffer = [];
	mesh.indexBuffer = [];
	mesh.faceNormalBuffer = [];

	var isBinary = false;
	var reader = new JSC3D.BinaryStream(data);

	// Detect whether this is an ASCII STL stream or a binary STL stream by checking a snippet of contents.
	reader.skip(HEADER_BYTES + FACE_COUNT_BYTES);
	for(var i=0; i<256 && !reader.eof(); i++) {
		if(reader.readUInt8() > 0x7f) {
			isBinary = true;
			break;
		}
	}

	if(JSC3D.console)
		JSC3D.console.logInfo('This is recognised as ' + (isBinary ? 'a binary' : 'an ASCII') + ' STL file.');

	if(!isBinary) {
		/*
		 * This should be an ASCII STL file.
		 * By Triffid Hunter <triffid.hunter@gmail.com>.
		 */

		var facePattern =	'facet\\s+normal\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
								'outer\\s+loop\\s+' +
									'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
									'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
									'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
								'endloop\\s+' +
							'endfacet';
		var faceRegExp = new RegExp(facePattern, 'ig');
		var matches = data.match(faceRegExp);

		if(matches) {
			var numOfFaces = matches.length;

			mesh.faceCount = numOfFaces;
			var v2i = {};

			// reset regexp for vertex extraction
			faceRegExp.lastIndex = 0;
			faceRegExp.global = false;

			// read faces
			for(var r=faceRegExp.exec(data); r!=null; r=faceRegExp.exec(data)) {
				mesh.faceNormalBuffer.push(parseFloat(r[1]), parseFloat(r[2]), parseFloat(r[3]));

				for(var i=0; i<FACE_VERTICES; i++) {
					var x = parseFloat(r[4 + (i * 3)]);
					var y = parseFloat(r[5 + (i * 3)]);
					var z = parseFloat(r[6 + (i * 3)]);

					// weld vertices by the given decimal precision
					var vertKey = x.toFixed(this.decimalPrecision) + '-' + y.toFixed(this.decimalPrecision) + '-' + z.toFixed(this.decimalPrecision);
					var vi = v2i[vertKey];
					if(vi === undefined) {
						vi = mesh.vertexBuffer.length / 3;
						v2i[vertKey] = vi;
						mesh.vertexBuffer.push(x);
						mesh.vertexBuffer.push(y);
						mesh.vertexBuffer.push(z);
					}
					mesh.indexBuffer.push(vi);
				}

				// mark the end of the indices of a face
				mesh.indexBuffer.push(-1);
			}
		}
	}
	else {
		/*
		 * This is a binary STL file.
		 */

		reader.reset();

		// skip 80-byte's STL file header
		reader.skip(HEADER_BYTES);

		// read face count
		var numOfFaces = reader.readUInt32();

		// calculate the expected length of the stream
		var expectedLen = HEADER_BYTES + FACE_COUNT_BYTES +
							(FACE_NORMAL_BYTES + VERTEX_BYTES * FACE_VERTICES + ATTRIB_BYTE_COUNT_BYTES) * numOfFaces;

		// is file complete?
		if(reader.size() < expectedLen) {
			if(JSC3D.console)
				JSC3D.console.logError('Failed to parse contents of the file. It seems not complete.');
			return;
		}

		mesh.faceCount = numOfFaces;
		var v2i = {};

		// read faces
		for(var i=0; i<numOfFaces; i++) {
			// read normal vector of a face
			mesh.faceNormalBuffer.push(reader.readFloat32());
			mesh.faceNormalBuffer.push(reader.readFloat32());
			mesh.faceNormalBuffer.push(reader.readFloat32());

			// read all 3 vertices of a face
			for(var j=0; j<FACE_VERTICES; j++) {
				// read coords of a vertex
				var x, y, z;
				x = reader.readFloat32();
				y = reader.readFloat32();
				z = reader.readFloat32();

				// weld vertices by the given decimal precision
				var vertKey = x.toFixed(this.decimalPrecision) + '-' + y.toFixed(this.decimalPrecision) + '-' + z.toFixed(this.decimalPrecision);
				var vi = v2i[vertKey];
				if(vi != undefined) {
					mesh.indexBuffer.push(vi);
				}
				else {
					vi = mesh.vertexBuffer.length / 3;
					v2i[vertKey] = vi;
					mesh.vertexBuffer.push(x);
					mesh.vertexBuffer.push(y);
					mesh.vertexBuffer.push(z);
					mesh.indexBuffer.push(vi);
				}
			}

			// mark the end of the indices of a face
			mesh.indexBuffer.push(-1);

			// skip 2-bytes' 'attribute byte count' field, since we do not deal with any additional attribs
			reader.skip(ATTRIB_BYTE_COUNT_BYTES);
		}
	}

	// add mesh to scene
	if(!mesh.isTrivial()) {
		// Some tools (Blender etc.) export STLs with empty face normals (all equal to 0). In this case we ...
		// ... simply set the face normal buffer to null so that they will be calculated in mesh's init stage.
		if( Math.abs(mesh.faceNormalBuffer[0]) < 1e-6 &&
			Math.abs(mesh.faceNormalBuffer[1]) < 1e-6 &&
			Math.abs(mesh.faceNormalBuffer[2]) < 1e-6 ) {
			mesh.faceNormalBuffer = null;
		}

		scene.addChild(mesh);
	}
};

JSC3D.StlLoader.prototype.onload = null;
JSC3D.StlLoader.prototype.onerror = null;
JSC3D.StlLoader.prototype.onprogress = null;
JSC3D.StlLoader.prototype.onresource = null;
JSC3D.StlLoader.prototype.decimalPrecision = 3;

JSC3D.LoaderSelector.registerLoader('stl', JSC3D.StlLoader);
