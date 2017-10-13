/**
	@class Math3D

	This class provides some utility methods for 3D mathematics.
 */
export class Math3D {
    /**
        Transform vectors using the given matrix.
        @param {JSC3D.Matrix3x4} mat the transformation matrix.
        @param {Array} vecs a batch of vectors to be transform.
        @param {Array} xfvecs where to output the transformed vetors.
        */
    transformVectors(mat, vecs, xfvecs) {
        for (var i = 0; i < vecs.length; i += 3) {
            var x = vecs[i];
            var y = vecs[i + 1];
            var z = vecs[i + 2];
            xfvecs[i] = mat.m00 * x + mat.m01 * y + mat.m02 * z + mat.m03;
            xfvecs[i + 1] = mat.m10 * x + mat.m11 * y + mat.m12 * z + mat.m13;
            xfvecs[i + 2] = mat.m20 * x + mat.m21 * y + mat.m22 * z + mat.m23;
        }
    }

    /**
        Transform vectors using the given matrix. Only z components (transformed) will be written out.
        @param {JSC3D.Matrix3x4} mat the transformation matrix.
        @param {Array} vecs a batch of vectors to be transform.
        @param {Array} xfveczs where to output the transformed z components of the input vectors.
        */
    transformVectorZs(mat, vecs, xfveczs) {
        var num = vecs.length / 3;
        var i = 0, j = 0;
        while (i < num) {
            xfveczs[i] = mat.m20 * vecs[j] + mat.m21 * vecs[j + 1] + mat.m22 * vecs[j + 2] + mat.m23;
            i++;
            j += 3;
        }
    }

    /**
        Normalize vectors.
        @param {Array} src a batch of vectors to be normalized.
        @param {Array} dest where to output the normalized results.
        */
    normalizeVectors(src, dest) {
        var num = src.length;
        for (var i = 0; i < num; i += 3) {
            var x = src[i];
            var y = src[i + 1];
            var z = src[i + 2];
            var len = Math.sqrt(x * x + y * y + z * z);
            if (len > 0) {
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
            }

            dest[i] = x;
            dest[i + 1] = y;
            dest[i + 2] = z;
        }
    }
}