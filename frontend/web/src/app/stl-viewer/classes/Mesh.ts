import { AABB } from './AABB';
import { Math3D } from './Math3D';

/**
 *   @class Mesh
 *   This class implements mesh that is used as an expression of 3D object and the basic primitive for rendering. <br />
 *   A mesh basically consists of a sequence of faces, and optioanlly a material, a texture mapping and other attributes and metadata.<br />
 *   A face consists of 3 or more coplanary vertex that should be descript in counter-clockwise order.<br />
 *   A texture mapping includes a valid texture object with a sequence of texture coordinats specified per vertex.<br />
 */
export class Mesh {

    /**
     * {String} Name of the mesh.
     */
    name = '';
    metadata = '';
    /**
     * {Boolean} Visibility of the mesh. If it is set to false, the mesh will be ignored in rendering.
     */
    visible = false;
    renderMode = 'flat';
    /**
     * {JSC3D.AABB} The Axis-aligned bounding box of the mesh. Read only.
     */
    aabb = null;
    /**
     * {Array} The plain sequence of vertex coordinates of the mesh.
     */
    vertexBuffer = null;
    /**
     * {Array} The sequence of vertex indices that describe faces. Each face contains at least 3 vertex
     * indices that are ended by a -1. Faces are not limited to triangles.
     */
    indexBuffer = null;
    vertexNormalBuffer = null;
    vertexNormalIndexBuffer = null;
    faceNormalBuffer = null;
    /**
     * {Array} The plain sequence of texture coordinates of the mesh, or null if none.
     */
    texCoordBuffer = null;
    /**
     * {Array} The sequence of tex coord indices. If it is null, the indexBuffer will be used.
     */
    texCoordIndexBuffer = null;
    material = null;
    texture = null;
    /**
     * {Number} Number of faces of the mesh. Read only.
     */
    faceCount = 0;
    /**
     * {Number} An angle to preserve sharp edges in smooth rendering. If the angle between the normals of two adjacent faces exceeds this
     * value, the edge will be recognized as an sharp edge thus it will not be smoothed.
     */
    creaseAngle = -180;
    /**
     * {Boolean} If set to true, both sides of the faces will be rendered.
     */
    isDoubleSided = false;
    /**
     * {Boolean} If set to true, the mesh accepts environment mapping.
     */
    isEnvironmentCast = false;
    internalId = 0;
    transformedVertexBuffer = null;
    transformedVertexNormalZBuffer = null;
    transformedFaceNormalZBuffer = null;
    transformedVertexNormalBuffer = null;

    constructor(name, visible, material, texture, creaseAngle, isDoubleSided, isEnvironmentCast, coordBuffer, indexBuffer, 
                texCoordBuffer, texCoordIndexBuffer) {
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
    }

    /**
     *  Initialize the mesh.
     */
    init() {
        if (this.isTrivial()) {
            return;
        }

        if (this.faceCount == 0) {
            this.calcFaceCount();
            if (this.faceCount == 0) {
                return;
            }
        }

        if (!this.aabb) {
            this.aabb = new AABB();
            this.calcAABB();
        }

        if (!this.faceNormalBuffer) {
            this.faceNormalBuffer = new Array(this.faceCount * 3);
            this.calcFaceNormals();
        }

        if (!this.vertexNormalBuffer) {
            if (this.creaseAngle >= 0) {
                this.calcCreasedVertexNormals();
            } else {
                this.vertexNormalBuffer = new Array(this.vertexBuffer.length);
                this.calcVertexNormals();
            }
        }

        this.normalizeFaceNormals();

        this.transformedVertexBuffer = new Array(this.vertexBuffer.length);
    }

    /**
     *  See if the mesh is a trivial mesh. A trivial mesh should be omited in any calculation or rendering.
     *   @returns {Boolean} true if it is trivial; false if not.
     */
    isTrivial() {
        return (!this.vertexBuffer || this.vertexBuffer.length < 3 ||
            !this.indexBuffer || this.indexBuffer.length < 3);
    }

    /**
     *    Set material for the mesh.
     *   @param {JSC3D.Material} material the material object.
     */
    setMaterial(material) {
        this.material = material;
    }

    /**
     *   Set texture for the mesh.
     *   @param {JSC3D.Texture} texture the texture object.
     */
    setTexture(texture) {
        this.texture = texture;
    }

    /**
     *   See if the mesh has valid texture mapping.
     *   @returns {Boolean} true if it has valid texture mapping; false if not.
     */
    hasTexture() {
        return ((this.texture != null) && this.texture.hasData() &&
            (this.texCoordBuffer != null) && (this.texCoordBuffer.length >= 2) &&
            ((this.texCoordIndexBuffer == null) || ((this.texCoordIndexBuffer.length >= 3) &&
            (this.texCoordIndexBuffer.length >= this.indexBuffer.length))));
    }

    /**
     *   Set render mode of the mesh.<br />
     *   Available render modes are:<br />
     *   '<b>point</b>':         render meshes as point clouds;<br />
     *   '<b>wireframe</b>':     render meshes as wireframe;<br />
     *   '<b>flat</b>':          render meshes as solid objects using flat shading;<br />
     *   '<b>smooth</b>':        render meshes as solid objects using smooth shading;<br />
     *   '<b>texture</b>':       render meshes as solid textured objects, no lighting will be apllied;<br />
     *   '<b>textureflat</b>':   render meshes as solid textured objects, lighting will be calculated per face;<br />
     *   '<b>texturesmooth</b>': render meshes as solid textured objects, lighting will be calculated per vertex and interpolated.<br />
     *   @param {String} mode new render mode.
     */
    setRenderMode(mode) {
        this.renderMode = mode;
    }

    /**
     *   Calculate count of faces.
     *   @private
     */
    calcFaceCount() {
        this.faceCount = 0;

        const ibuf = this.indexBuffer;

        // add the last -1 if it is omitted
        if (ibuf[ibuf.length - 1] != -1) {
            ibuf.push(-1);
        }

        for (const buf of ibuf) {
            if (ibuf === -1) {
                this.faceCount++;
            }
        }
    }

    /**
     *   Calculate AABB of the mesh.
     *   @private
     */
    calcAABB() {
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        const vbuf = this.vertexBuffer;
        for (let i = 0; i < vbuf.length; i += 3) {
            const x = vbuf[i];
            const y = vbuf[i + 1];
            const z = vbuf[i + 2];

            if (x < minX) {
                minX = x;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (y > maxY) {
                maxY = y;
            }
            if (z < minZ) {
                minZ = z;
            }
            if (z > maxZ) {
                maxZ = z;
            }
        }

        this.aabb.minX = minX;
        this.aabb.minY = minY;
        this.aabb.minZ = minZ;
        this.aabb.maxX = maxX;
        this.aabb.maxY = maxY;
        this.aabb.maxZ = maxZ;
    }

    /**
     *   Calculate per face normals. The reault remain un-normalized for later vertex normal calculations.
     *   @private
     */
    calcFaceNormals() {
        const vbuf = this.vertexBuffer;
        const ibuf = this.indexBuffer;
        const nbuf = this.faceNormalBuffer;
        let i = 0;
        let j = 0;
        while (i < ibuf.length) {
            let index = ibuf[i++] * 3;
            const x0 = vbuf[index];
            const y0 = vbuf[index + 1];
            const z0 = vbuf[index + 2];

            index = ibuf[i++] * 3;
            const x1 = vbuf[index];
            const y1 = vbuf[index + 1];
            const z1 = vbuf[index + 2];

            index = ibuf[i++] * 3;
            const x2 = vbuf[index];
            const y2 = vbuf[index + 1];
            const z2 = vbuf[index + 2];

            const dx1 = x1 - x0;
            const dy1 = y1 - y0;
            const dz1 = z1 - z0;
            const dx2 = x2 - x0;
            const dy2 = y2 - y0;
            const dz2 = z2 - z0;

            const nx = dy1 * dz2 - dz1 * dy2;
            const ny = dz1 * dx2 - dx1 * dz2;
            const nz = dx1 * dy2 - dy1 * dx2;

            nbuf[j++] = nx;
            nbuf[j++] = ny;
            nbuf[j++] = nz;

            do {
            } while (ibuf[i++] !== -1);
        }
    }

    /**
     *   Normalize face normals.
     *   @private
     */
    normalizeFaceNormals() {
        new Math3D().normalizeVectors(this.faceNormalBuffer, this.faceNormalBuffer);
    }

    /**
     *   Calculate per vertex normals.
     *   @private
     */
    calcVertexNormals() {
        if (!this.faceNormalBuffer) {
            this.faceNormalBuffer = new Array(this.faceCount * 3);
            this.calcFaceNormals();
        }

        const vbuf = this.vertexBuffer;
        const ibuf = this.indexBuffer;
        const fnbuf = this.faceNormalBuffer;
        const vnbuf = this.vertexNormalBuffer;
        for (let i = 0; i < vnbuf.length; i++) {
            vnbuf[i] = 0;
        }

        // in this case, the vertex normal index buffer should be set to null
        // since the vertex index buffer will be used to reference vertex normals
        this.vertexNormalIndexBuffer = null;

        const numOfVertices = vbuf.length / 3;

        /*
            Generate vertex normals.
            Normals of faces around each vertex will be summed to calculate that vertex normal.
        */
        let i = 0;
        let j = 0;
        let k = 0;
        while (i < ibuf.length) {
            k = ibuf[i++];
            if (k === -1) {
                j += 3;
            } else {
                const index = k * 3;
                // add face normal to vertex normal
                vnbuf[index] += fnbuf[j];
                vnbuf[index + 1] += fnbuf[j + 1];
                vnbuf[index + 2] += fnbuf[j + 2];
            }
        }

        // normalize vertex normals
        new Math3D().normalizeVectors(vnbuf, vnbuf);
    }

    /**
     *   Calculate per vertex normals. The given crease-angle will be taken into account.
     *   @private
     */
    calcCreasedVertexNormals() {
        if (!this.faceNormalBuffer) {
            this.faceNormalBuffer = new Array(this.faceCount * 3);
            this.calcFaceNormals();
        }

        const ibuf = this.indexBuffer;
        const numOfVerts = this.vertexBuffer.length / 3;

        /*
            Go through vertices. For each one, record the indices of faces who touch this vertex.
            The new length of the vertex normal buffer will also be calculated.
        */
        const vertTouchedFaces = new Array(numOfVerts);
        let expectedVertNormalBufferLength = 0;
        for (let i = 0, findex = 0, vindex = 0; i < ibuf.length; i++) {
            vindex = ibuf[i];
            if (vindex >= 0) {
                expectedVertNormalBufferLength += 3;
                const faces = vertTouchedFaces[vindex];
                if (!faces) {
                    vertTouchedFaces[vindex] = [findex];
                } else {
                    faces.push(findex);
                }
            } else {
                findex++;
            }
        }

        const fnbuf = this.faceNormalBuffer;
        // generate normalized face normals which will be used for calculating dot product
        const nfnbuf = new Array(fnbuf.length);
        new Math3D().normalizeVectors(fnbuf, nfnbuf);

        // realloc and initialize the vertex normal buffer
        if (!this.vertexNormalBuffer || this.vertexNormalBuffer.length < expectedVertNormalBufferLength) {
            this.vertexNormalBuffer = new Array(expectedVertNormalBufferLength);
        }
        const vnbuf = this.vertexNormalBuffer;
        for (let i = 0; i < vnbuf.length; i++) {
            vnbuf[i] = 0;
        }

        // the vertex normal index buffer will be re-calculated
        this.vertexNormalIndexBuffer = [];
        const nibuf = this.vertexNormalIndexBuffer;

        /*
            Generate vertex normals and normal indices.
            In this case, There will be a separate normal for each vertex of each face.
        */
        const threshold = Math.cos(this.creaseAngle * Math.PI / 180);
        for (let i = 0, vindex = 0, nindex = 0, findex0 = 0; i < ibuf.length; i++) {
            vindex = ibuf[i];
            if (vindex >= 0) {
                const n = nindex * 3;
                const f0 = findex0 * 3;
                // add face normal to vertex normal
                vnbuf[n] += fnbuf[f0];
                vnbuf[n + 1] += fnbuf[f0 + 1];
                vnbuf[n + 2] += fnbuf[f0 + 2];
                const fnx0 = nfnbuf[f0];
                const fny0 = nfnbuf[f0 + 1];
                const fnz0 = nfnbuf[f0 + 2];
                // go through faces around this vertex, accumulating normals
                const faces = vertTouchedFaces[vindex];
                for (const face of faces) {
                    if (findex0 !== face) {
                        const f1 = face * 3;
                        const fnx1 = nfnbuf[f1];
                        const fny1 = nfnbuf[f1 + 1];
                        const fnz1 = nfnbuf[f1 + 2];
                        // if the angle between normals of the adjacent faces is less than the crease-angle, the
                        // normal of the other face will be accumulated to the vertex normal of the current face
                        if (fnx0 * fnx1 + fny0 * fny1 + fnz0 * fnz1 > threshold) {
                            vnbuf[n] += fnbuf[f1];
                            vnbuf[n + 1] += fnbuf[f1 + 1];
                            vnbuf[n + 2] += fnbuf[f1 + 2];
                        }
                    }
                }
                nibuf.push(nindex++);
            } else {
                findex0++;
                nibuf.push(-1);
            }
        }

        // normalize the results
        new Math3D().normalizeVectors(vnbuf, vnbuf);
    }

    checkValid() {
        // TODO: not implemented yet
    }

}
