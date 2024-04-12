/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel
     * Use same parameters as for MeshNormalMaterial.
     *
     *
     */
export class MeshNormalDepthMaterial {
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
//# sourceMappingURL=MeshNormalDepthMaterial.d.ts.map