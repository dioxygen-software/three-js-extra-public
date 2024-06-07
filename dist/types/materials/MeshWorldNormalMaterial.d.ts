import { ShaderMaterial, type ShaderMaterialParameters, Vector2, type Mesh, type Texture, type NormalMapTypes } from 'three';
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
export { MeshWorldNormalMaterial };
//# sourceMappingURL=MeshWorldNormalMaterial.d.ts.map