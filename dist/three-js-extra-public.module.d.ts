import { IcosahedronBufferGeometry, BufferGeometry, ShaderMaterial, Texture, NormalMapTypes, Vector2, ShaderMaterialParameters, MeshDepthMaterial, MeshDepthMaterialParameters, Mesh, Vector3, Box3 } from 'three';

/**
 * @author baptistewagner & lucassort
 */
declare class IcosahedronSphereBufferGeometry extends IcosahedronBufferGeometry {
    constructor(radius: number, subdivisionsLevel: number);
}

/**
 * @author baptistewagner & lucassort
 */
declare class RoundedCubeBufferGeometry extends BufferGeometry {
    parameters: {
        radius: number;
        widthHeightSegments: number;
    };
    constructor(radius?: number, widthHeightSegments?: number);
}

declare class SpherifiedCubeBufferGeometry extends BufferGeometry {
    parameters: {
        radius: number;
        widthHeightSegments: number;
    };
    constructor(radius: number, widthHeightSegments: number);
}

interface MeshNormalDepthMaterialParameters extends ShaderMaterialParameters {
    linearize_depth: boolean;
}
/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rgb channels as well as Depth inside the alpha channel
     * Use same parameters as for MeshNormalMaterial.
     */
declare class MeshNormalDepthMaterial extends ShaderMaterial {
    bumpMap: Texture | null;
    bumpScale: number;
    normalMap: Texture | null;
    normalMapType: NormalMapTypes;
    normalScale: Vector2;
    displacementMap: Texture | null;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    isMeshNormalMaterial: boolean;
    isMeshNormalDepthMaterial: boolean;
    constructor(parameters: MeshNormalDepthMaterialParameters);
}
//# sourceMappingURL=MeshNormalDepthMaterial.d.ts.map

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
declare class MeshRGBADepthMaterial extends MeshDepthMaterial {
    constructor(parameters: MeshDepthMaterialParameters);
}
//# sourceMappingURL=MeshRGBADepthMaterial.d.ts.map

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
declare class MeshViewPositionMaterial extends ShaderMaterial {
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    constructor(parameters: ShaderMaterialParameters);
}
//# sourceMappingURL=MeshViewPositionMaterial.d.ts.map

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
declare class MeshWorldNormalMaterial extends ShaderMaterial {
    bumpMap: Texture | null;
    bumpScale: number;
    normalMap: Texture | null;
    normalMapType: NormalMapTypes;
    normalScale: Vector2;
    displacementMap: Texture | null;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    isMeshNormalMaterial: boolean;
    isMeshWorldNormalMaterial: boolean;
    constructor(parameters: ShaderMaterialParameters);
    /**
     *  Helper to update the mesh onBeforeRender function to update the vewMatrixInverse uniform.
     *  Call it only once on each mesh or it may impact performances.
     *  Note that previously set onBeforeRender will be preserved.
     */
    updateMeshOnBeforeRender: (mesh: Mesh) => void;
}
//# sourceMappingURL=MeshWorldNormalMaterial.d.ts.map

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 */
declare class MeshWorldPositionMaterial extends ShaderMaterial {
    displacementMap: Texture | null;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    isMeshDepthMaterial: boolean;
    isMeshWorldPositionMaterial: boolean;
    constructor(parameters: ShaderMaterialParameters);
}
//# sourceMappingURL=MeshWorldPositionMaterial.d.ts.map

declare class EdgeSplitModifier {
    modify(geometry: BufferGeometry, cutOffAngle: number, tryKeepNormals?: boolean): BufferGeometry | undefined;
}
//# sourceMappingURL=EdgeSplitModifier.d.ts.map

/**
 * @author Max Godefroy <max@godefroy.net>
 */
declare class ConeFrustum {
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
     * @returns The cube position vertex coordinates as a flat array
     */
    static computeOptimisedDownscalingBoundingCube(center0: Vector3, radius0: number, center1: Vector3, radius1: number, origin?: Vector3 | null, minScale?: number): Float32Array;
    equals(frustum: ConeFrustum): boolean;
}

declare module "three" {
    interface Ray {
        intersectsConeFrustum(frustum: ConeFrustum, target: Vector3 | null): Vector3 | null;
    }
}
//# sourceMappingURL=RayIntersect.d.ts.map

declare class Cone {
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
    getBoundingBox(target: Vector3): void;
    equals(cone: Cone): boolean;
}
declare module "three" {
    interface Ray {
        intersectsCone(cone: Cone, target: Vector3): Vector3 | null;
    }
}

export { Cone, ConeFrustum, EdgeSplitModifier, IcosahedronSphereBufferGeometry, MeshNormalDepthMaterial, MeshRGBADepthMaterial, MeshViewPositionMaterial, MeshWorldNormalMaterial, MeshWorldPositionMaterial, RoundedCubeBufferGeometry, SpherifiedCubeBufferGeometry };
