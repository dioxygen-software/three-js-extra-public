/**
 * @author Max Godefroy <max@godefroy.net>
 */
export declare class ConeFrustum {
    /**
     * @param base      {?Vector3}
     * @param axis      {?Vector3}
     * @param height    {?number}
     * @param radius0   {?number}
     * @param radius1   {?number}
     */
    constructor(base: any, axis: any, height: any, radius0: any, radius1: any);
    /**
     * @param center0   {!Vector3}
     * @param radius0   {number}
     * @param center1   {!Vector3}
     * @param radius1   {number}
     * @returns {ConeFrustum}
     */
    static fromCapsule(center0: any, radius0: any, center1: any, radius1: any): any;
    /**
     *  Project the given point on the axis, in a direction orthogonal to the cone frustum surface.
     **/
    orthogonalProject(p: any, target: any): void;
    /**
     * @param frustum   {!ConeFrustum}
     */
    copy(frustum: any): void;
    clone(): void;
    empty(): boolean;
    /**
     * @param target    {?Box3}
     * @returns {!Box3}
     */
    getBoundingBox(target: any): any;
    /**
     * @deprecated Use `ConeFrustum.computeOptimisedDownscalingBoundingCube` instead
     *
     * @param {!Vector3} origin		The origin for the current coordinate space
     *
     * @returns {Float32Array} 		The cube position vertex coordinates as a flat array
     */
    computeOptimisedBoundingCube(origin: any): any;
    /**
     * @param {!Vector3} center0
     * @param {!number} radius0
     * @param {!Vector3} center1
     * @param {!number} radius1
     * @param {?Vector3} origin		The origin for the current coordinate space. Can be null.
     * @param {?number} minScale
     *
     * @returns {Float32Array} 		The cube position vertex coordinates as a flat array
     */
    static computeOptimisedDownscalingBoundingCube(center0: any, radius0: any, center1: any, radius1: any, origin: any, minScale: any): any;
    /**
     * @param frustum   {!ConeFrustum}
     * @returns {boolean}
     */
    equals(frustum: any): any;
}
//# sourceMappingURL=ConeFrustum.d.ts.map