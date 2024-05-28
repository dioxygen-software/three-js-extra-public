import { Box3, Vector3 } from "three";
/**
 * @author Max Godefroy <max@godefroy.net>
 */
export declare class ConeFrustum {
    base: Vector3;
    axis: Vector3;
    height: number;
    radius0: number;
    radius1: number;
    constructor(base?: Vector3, axis?: Vector3, height?: number, radius0?: number, radius1?: number);
    static fromCapsule(center0: Vector3, radius0: number, center1: Vector3, radius1: number): ConeFrustum;
    /**
     *  Project the given point on the axis, in a direction orthogonal to the cone frustum surface.
     **/
    orthogonalProject(p: Vector3, target: Vector3): void;
    copy(frustum: ConeFrustum): void;
    clone(): void;
    empty(): boolean;
    getBoundingBox(target?: Box3): Box3;
    /**
     * @deprecated Use `ConeFrustum.computeOptimisedDownscalingBoundingCube` instead
     *
     * @param origin		The origin for the current coordinate space
     *
     * @returns The cube position vertex coordinates as a flat array
     */
    computeOptimisedBoundingCube(origin: Vector3): ArrayLike<number>;
    /**
     * @param origin		The origin for the current coordinate space. Can be null.
     *
     * @returns {Float32Array} 		The cube position vertex coordinates as a flat array
     */
    static computeOptimisedDownscalingBoundingCube(center0: Vector3, radius0: number, center1: Vector3, radius1: number, origin?: Vector3 | null, minScale?: number): Float32Array;
    equals(frustum: ConeFrustum): boolean;
}
//# sourceMappingURL=ConeFrustum.d.ts.map