export class Scene  {
constructor(name) {
	this.name = name || '';
	this.srcUrl = '';
	this.aabb = null;
	this.children = [];
	this.maxChildId = 1;
};

/**
	Initialize the scene.
 */
init() {
	if(this.isEmpty())
		return;

	for(var i=0; i<this.children.length; i++)
		this.children[i].init();

	if(!this.aabb) {
		this.aabb = new JSC3D.AABB;
		this.calcAABB();
	}
};

/**
	See if the scene is empty.
	@returns {Boolean} true if it does not contain meshes; false if it has any.
 */
isEmpty() {
	return (this.children.length == 0);
};

/**
	Add a mesh to the scene.
	@param {JSC3D.Mesh} mesh the mesh to be added.
 */
addChild(mesh) {
	mesh.internalId = this.maxChildId++;
	this.children.push(mesh);
};

/**
	Remove a mesh from the scene.
	@param {JSC3D.Mesh} mesh the mesh to be removed.
 */
removeChild(mesh) {
	var foundAt = this.children.indexOf(mesh);
	if(foundAt >= 0)
		this.children.splice(foundAt, 1);
};

/**
	Get all meshes in the scene.
	@returns {Array} meshes as an array.
 */
getChildren() {
	return this.children.slice(0);
};

/**
	Traverse meshes in the scene, calling a given function on each of them.
	@param {Function} operator a function that will be called on each mesh.
 */
forEachChild(operator) {
	if((typeof operator) != 'function')
		return;

	for(var i=0; i<this.children.length; i++) {
		if(operator.call(null, this.children[i]))
			break;
	}
};

/**
	Calculate AABB of the scene.
	@private
 */
calcAABB() {
	this.aabb.minX = this.aabb.minY = this.aabb.minZ = Infinity;
	this.aabb.maxX = this.aabb.maxY = this.aabb.maxZ = -Infinity;
	for(var i=0; i<this.children.length; i++) {
		var child = this.children[i];
		if(!child.isTrivial()) {
			var minX = child.aabb.minX;
			var minY = child.aabb.minY;
			var minZ = child.aabb.minZ;
			var maxX = child.aabb.maxX;
			var maxY = child.aabb.maxY;
			var maxZ = child.aabb.maxZ;
			if(this.aabb.minX > minX)
				this.aabb.minX = minX;
			if(this.aabb.minY > minY)
				this.aabb.minY = minY;
			if(this.aabb.minZ > minZ)
				this.aabb.minZ = minZ;
			if(this.aabb.maxX < maxX)
				this.aabb.maxX = maxX;
			if(this.aabb.maxY < maxY)
				this.aabb.maxY = maxY;
			if(this.aabb.maxZ < maxZ)
				this.aabb.maxZ = maxZ;
		}
	}
};

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
aabb = null;
children = null;
maxChildId = 1;


/**
	@class Mesh

	This class implements mesh that is used as an expression of 3D object and the basic primitive for rendering. <br />
	A mesh basically consists of a sequence of faces, and optioanlly a material, a texture mapping and other attributes and metadata.<br />
	A face consists of 3 or more coplanary vertex that should be descript in counter-clockwise order.<br />
	A texture mapping includes a valid texture object with a sequence of texture coordinats specified per vertex.<br />
 */
}
