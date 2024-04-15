export declare class Cone {
    /**
     *  @param {Vector3} v The cone origin
     *  @param {Vector3} axis The axis, normalized.
     *  @param {number} theta The cone angle
     *  @param {number} sup The maximum distance from v in the axis direction (truncated cone). If null or undefined, will be +infinity
     *  @param {number} inf The minimum distance from v in the axis direction (truncated cone). if null or undefined, will be 0
     */
    constructor(v: any, axis: any, theta: any, inf: any, sup: any);
    set(v: any, axis: any, theta: any, inf: any, sup: any): this;
    clone(): Cone;
    copy(cone: any): this;
    empty(): boolean;
    getBoundingBox(target: any): void;
    equals(cone: any): any;
}
//# sourceMappingURL=Cone.d.ts.map