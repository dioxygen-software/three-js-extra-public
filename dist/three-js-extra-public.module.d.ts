import { IcosahedronBufferGeometry, BufferGeometry } from 'three';

/**
 * @author Max Godefroy <max@godefroy.net>
 */
declare class ConeFrustum {
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

/**
 * @author baptistewagner & lucassort
 */
declare class IcosahedronSphereBufferGeometry extends IcosahedronBufferGeometry {
    constructor(radius: any, subdivisionsLevel: any);
}

/**
 * @author baptistewagner & lucassort
 */
declare class RoundedCubeBufferGeometry extends BufferGeometry {
    constructor(radius: any, widthHeightSegments: any);
}

declare class SpherifiedCubeBufferGeometry extends BufferGeometry {
    constructor(radius: any, widthHeightSegments: any);
}

declare class Cone {
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

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel
     * Use same parameters as for MeshNormalMaterial.
     *
     *
     */
declare class MeshNormalDepthMaterial {
    constructor(parameters: any);
    bumpMap: any;
    bumpScale: number;
    normalMap: any;
    normalMapType: any;
    normalScale: any;
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    wireframe: boolean;
    wireframeLinewidth: number;
    fog: boolean;
    lights: boolean;
    skinning: boolean;
    morphTargets: boolean;
    morphNormals: boolean;
    isMeshNormalMaterial: boolean;
    isMeshNormalDepthMaterial: boolean;
}

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
declare class MeshRGBADepthMaterial {
    constructor(parameters: any);
}

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * @param {boolean} useFloatTexture If true, we consider floatTexture extension is activated and available.
     *                                  The resulting coordinates will be stored in RGB components.
     *                                  If false (default), the coordinate to store must be defined by parameters.coordinate
     *                                  and will be packed in RGBA.
     * @param {string} coordinate x, y or z to choose which coordinate will be packed in RGBA using THREE.JS packDepthToRGBA. Values will be mapped from -1:1 to 0:0.5 since
     *                            depth packing does only provide methods to store in [0,1[ To recover the view coordinate, you need to do
     *                            x = 4*unpackRGBAToDepth(rgba) - 1;
     */
declare class MeshViewPositionMaterial {
    constructor(parameters: any);
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    wireframe: boolean;
    wireframeLinewidth: number;
    fog: boolean;
    lights: boolean;
    skinning: boolean;
    morphTargets: boolean;
}

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save world space normals in pixels, the way MeshNormalMaterial does for view space normals.
     * Use same parameters as for MeshNormalMaterial.
     *
     * You need to update the uniform viewMatrixInverse for this material to work properly.
     * If you don't want to do it by yourself, just call MeshWorldNormalMaterial.updateMeshOnBeforeRender on any mesh using this material.
     * see MeshWorldNormalMaterial.updateMeshOnBeforeRender for more details.
     */
declare class MeshWorldNormalMaterial {
    constructor(parameters: any);
    bumpMap: any;
    bumpScale: number;
    normalMap: any;
    normalMapType: any;
    normalScale: any;
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    wireframe: boolean;
    wireframeLinewidth: number;
    fog: boolean;
    lights: boolean;
    skinning: boolean;
    morphTargets: boolean;
    morphNormals: boolean;
    isMeshNormalMaterial: boolean;
    isMeshWorldNormalMaterial: boolean;
    /**
     *  Helper to update the mesh onBeforeRender function to update the vewMatrixInverse uniform.
     *  Call it only once on each mesh or it may impact performances.
     *  Note that previously set onBeforeRender will be preserved.
     */
    updateMeshOnBeforeRender: (mesh: any) => void;
}

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 */
declare class MeshWorldPositionMaterial {
    constructor(parameters: any);
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    wireframe: boolean;
    wireframeLinewidth: number;
    fog: boolean;
    lights: boolean;
    skinning: boolean;
    morphTargets: boolean;
    isMeshDepthMaterial: boolean;
    isMeshWorldPositionMaterial: boolean;
}

declare class EdgeSplitModifier {
    modify(geometry: any, cutOffAngle: any, tryKeepNormals?: boolean): any;
}

export { Cone, ConeFrustum, EdgeSplitModifier, IcosahedronSphereBufferGeometry, MeshNormalDepthMaterial, MeshRGBADepthMaterial, MeshViewPositionMaterial, MeshWorldNormalMaterial, MeshWorldPositionMaterial, RoundedCubeBufferGeometry, SpherifiedCubeBufferGeometry };
