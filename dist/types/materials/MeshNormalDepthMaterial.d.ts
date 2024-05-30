import { ShaderMaterial, type ShaderMaterialParameters, Vector2, type Texture, type NormalMapTypes } from 'three';
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
export { MeshNormalDepthMaterial };
//# sourceMappingURL=MeshNormalDepthMaterial.d.ts.map