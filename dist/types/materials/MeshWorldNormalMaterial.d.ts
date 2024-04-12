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
export class MeshWorldNormalMaterial {
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
//# sourceMappingURL=MeshWorldNormalMaterial.d.ts.map