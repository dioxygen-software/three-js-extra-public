import { ShaderMaterial, Vector2, MeshDepthMaterial } from 'three';

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel
     * Use same parameters as for MeshNormalMaterial.
     *
     *
     */
declare class MeshNormalDepthMaterial extends ShaderMaterial {
    constructor(parameters: any);
    bumpMap: any;
    bumpScale: number;
    normalMap: any;
    normalMapType: 0;
    normalScale: Vector2;
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
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
declare class MeshRGBADepthMaterial extends MeshDepthMaterial {
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
declare class MeshViewPositionMaterial extends ShaderMaterial {
    constructor(parameters: any);
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
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
declare class MeshWorldNormalMaterial extends ShaderMaterial {
    constructor(parameters: any);
    bumpMap: any;
    bumpScale: number;
    normalMap: any;
    normalMapType: 0;
    normalScale: Vector2;
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
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
declare class MeshWorldPositionMaterial extends ShaderMaterial {
    constructor(parameters: any);
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    morphTargets: boolean;
    isMeshDepthMaterial: boolean;
    isMeshWorldPositionMaterial: boolean;
}

declare class EdgeSplitModifier {
    modify(geometry: any, cutOffAngle: any, tryKeepNormals?: boolean): any;
}

export { EdgeSplitModifier, MeshNormalDepthMaterial, MeshRGBADepthMaterial, MeshViewPositionMaterial, MeshWorldNormalMaterial, MeshWorldPositionMaterial };
