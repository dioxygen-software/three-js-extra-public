import { Vector3 } from "three";
export declare class Cone {
    v: Vector3;
    axis: Vector3;
    theta: number;
    inf: number;
    sup: number;
    cosTheta: number;
    /**
     *  A cone is defined by a singular point v, a direction axis, an angle theta, and two distances inf and sup.
     *  It is single-sided and does not have a base.
     *
     *  @param v The cone origin
     *  @param axis The axis, normalized.
     *  @param theta The cone angle
     *  @param sup The maximum distance from v in the axis direction (truncated cone). If null or undefined, will be +infinity
     *  @param inf The minimum distance from v in the axis direction (truncated cone). if null or undefined, will be 0
     */
    constructor(v?: Vector3, axis?: Vector3, theta?: number, inf?: number, sup?: number);
    set(v: Vector3, axis: Vector3, theta: number, inf: number, sup: number): this;
    clone(): Cone;
    copy(cone: Cone): Cone;
    empty(): boolean;
    getBoundingBox(_: Vector3): void;
    equals(cone: Cone): boolean;
}
declare module "three" {
    interface Ray {
        intersectsCone(cone: Cone, target: Vector3): Vector3 | null;
    }
}
//# sourceMappingURL=Cone.d.ts.map