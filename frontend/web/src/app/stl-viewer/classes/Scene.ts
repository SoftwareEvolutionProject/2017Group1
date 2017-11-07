import { AABB } from './AABB';

/**
	@class Scene

	This class implements scene that contains a group of meshes that forms the world.
 */
export class Scene {
    /**
     * {String} Name of the scene.
     */
    name = '';
    /**
     * {String} Source URL of the scene, empty if none. Read only.
     */
    srcUrl = '';
    /**
     * {JSC3D.AABB} The Axis-aligned bounding box of the whole scene. Read only.
     */
    aabb: AABB = null;
    children = null;
    maxChildId = 1;

    constructor(name) {
        this.name = name || '';
        this.srcUrl = '';
        this.aabb = null;
        this.children = [];
        this.maxChildId = 1;
    }

    /**
        Initialize the scene.
    */
    init() {
        if (this.isEmpty()) {
            return;
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].init();
        }

        if (!this.aabb) {
            this.aabb = new AABB();
            this.calcAABB();
        }
    }

    /**
        See if the scene is empty.
        @returns {Boolean} true if it does not contain meshes; false if it has any.
    */
    isEmpty() {
        return (this.children.length == 0);
    }

    /**
        Add a mesh to the scene.
        @param {JSC3D.Mesh} mesh the mesh to be added.
    */
    addChild(mesh) {
        mesh.internalId = this.maxChildId++;
        this.children.push(mesh);
    }

    /**
        Remove a mesh from the scene.
        @param {JSC3D.Mesh} mesh the mesh to be removed.
    */
    removeChild(mesh) {
        const foundAt = this.children.indexOf(mesh);
        if (foundAt >= 0) {
            this.children.splice(foundAt, 1);
        }
    }

    /**
        Get all meshes in the scene.
        @returns {Array} meshes as an array.
    */
    getChildren() {
        return this.children.slice(0);
    }

    /**
	Calculate AABB of the scene.
	@private
    */
    private calcAABB() {
        this.aabb.minX = this.aabb.minY = this.aabb.minZ = Infinity;
        this.aabb.maxX = this.aabb.maxY = this.aabb.maxZ = -Infinity;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (!child.isTrivial()) {
                const minX = child.aabb.minX;
                const minY = child.aabb.minY;
                const minZ = child.aabb.minZ;
                const maxX = child.aabb.maxX;
                const maxY = child.aabb.maxY;
                const maxZ = child.aabb.maxZ;
                if (this.aabb.minX > minX) {
                    this.aabb.minX = minX;
                }
                if (this.aabb.minY > minY) {
                    this.aabb.minY = minY;
                }
                if (this.aabb.minZ > minZ) {
                    this.aabb.minZ = minZ;
                }
                if (this.aabb.maxX < maxX) {
                    this.aabb.maxX = maxX;
                }
                if (this.aabb.maxY < maxY) {
                    this.aabb.maxY = maxY;
                }
                if (this.aabb.maxZ < maxZ) {
                    this.aabb.maxZ = maxZ;
                }
            }
        }
    }
}
