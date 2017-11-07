/**
	@class PickInfo

	PickInfo is used as the return value of {JSC3D.Viewer}'s pick() method, holding picking result on a given position
	on the canvas.
 */
export class PickInfo {
	/**
	 * {Number} X coordinate on canvas.
	 */
	canvasX = 0;
	/**
	 * {Number} Y coordinate on canvas.
	 */
	canvasY = 0;
	/**
	 * {Number} The depth value.
	 */
	depth = -Infinity;
	/**
	 * {JSC3D.Mesh} Mesh picked on current position or null if none.
	 */
	mesh = null;
}
